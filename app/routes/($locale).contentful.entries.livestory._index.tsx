import {useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import type { PropsWithChildren } from 'react';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.contentfulData?.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  
  const SPACE_ID = context.env.CONTENTFUL_SPACE_ID;
  const ACCESS_TOKEN = context.env.CONTENTFUL_ACCESS_TOKEN;
  const CONTENTFUL_URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE_ID}`;

  const [contentfulResponse] = await Promise.all([
    fetch(CONTENTFUL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({query}),
    }).then(res => res.json()),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!contentfulResponse) {
    throw new Response('Not Found', {status: 404});
  }

  const items = (contentfulResponse as ContentfulResponse)?.data?.liveStoryContentTypeCollection?.items;

  return {
    items,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

type LiveStoryItem = {
  id: string;
  title: string;
  type: string;
  ssc: string | null;
  sys: { id: string };
};

type ContentfulResponse = {
  data?: {
    liveStoryContentTypeCollection?: {
      items: LiveStoryItem[];
    };
  };
};

export default function LiveStoryEntries(){
  const {items} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>Live Story Contentful experiences</h1>
      </header>
      <main>
        <ul style={{ listStyle: 'none', padding: 0 }}>
        {items?.map(item => {

          return (
            <li key={item.id} style={{ marginBottom: '12px' }}>
              <a
                href={'/contentful/entries/livestory/' + item.sys.id}
                rel="noopener noreferrer"
                style={{
                  color: '#000',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
      </main>
    </div>
  );
}

const query = `
    query{
        liveStoryContentTypeCollection{
            items{
                sys {
                  id
                }
                title
                id
                type
                ssc
            }
        }
    }
  `;
