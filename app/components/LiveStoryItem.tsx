import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

type LiveStoryItem = {
  id: string;
  title: string;
  type: string;
  ssc: string | null;
  sys: { id: string };
  coverImg: string;
};

export function LiveStoryItem({
  item,
  loading,
}: {
  item: LiveStoryItem;
  loading?: 'eager' | 'lazy';
}) {
  const image = item.coverImg;
  return (
    <Link
      className="livestory-item"
      key={item.id}
      prefetch="intent"
      to={`/contentful/entries/livestory/${item.sys.id}`}
    >
      {image && (
        <Image
          alt={item.title}
          aspectRatio="1/1"
          src={item.coverImg}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{item.title}</h4>
    </Link>
  );
}
