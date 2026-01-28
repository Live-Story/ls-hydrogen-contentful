import {Link, redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/pages.$handle';
import { LiveStory } from 'ls-client-sdk/client';
import type { LiveStoryEntry, LiveStoryProps } from 'ls-client-sdk/client';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.contentfulData?.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  if (!args.params.id) {
    return redirect('/livestory');
  }

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

  const [contentfulEntryResponse] = await Promise.all([
    fetch(CONTENTFUL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query($id: String!) {
            liveStoryContentTypeCollection(where: { sys: { id: $id } }, limit: 1) {
              items {
                sys { id }
                id
                title
                type
                ssc
                coverImg
              }
            }
          }
        `,
        variables: { id: params.id },
      })
    }).then(res => res.json()),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!contentfulEntryResponse) {
    throw new Response('Not Found', {status: 404});
  }

  const entry: LiveStoryEntry = (contentfulEntryResponse as ContentfulResponse)?.data?.liveStoryContentTypeCollection.items[0];

  let liveStorySSR = '';
  if (entry?.ssc) {
    liveStorySSR = await fetch(entry.ssc).then(res => res.text());
  }
  
  return {
    entry,
    liveStorySSR
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

type ContentfulResponse = {
  data: {
    liveStoryContentTypeCollection: {
      items: LiveStoryEntry[];
    };
  };
};

export default function LiveStoryContentfulEntry(){
  const {entry, liveStorySSR} = useLoaderData<typeof loader>();

  if (!entry) {
    return null;
  }

  if (liveStorySSR) {
    entry.ssr = liveStorySSR; // enahance entry with ssr content
  }

  const props: LiveStoryProps = {
    entry,
    language: "en", // hardcoded for demo purposes, optional
    store: "default" // hardcoded for demo purposes, optional
  };

  return (
    <div className="page">
      <header>
        <h1>Live Story Contentful entry: { entry?.sys?.id }</h1>
      </header>
      <main>
        <h2>{ entry?.title }</h2>
        <p>Live Story type: { entry?.type }</p>
        <p>Live Story ID: { entry?.id }</p>
        <p>Live Story SSR: {entry?.ssr ? <Link to={entry?.ssc || ''} target='blank'>{ entry?.ssc || <i>not set</i>}</Link> : <i>not set</i>}</p>

        <LiveStory {...props} />
      </main>
    </div>
  );
}
