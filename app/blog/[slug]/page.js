import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug } from "../../../lib/site";
import { getPostSlugs, getPost, getPostMeta } from "../../../lib/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  try {
    const meta = getPostMeta(params.slug);
    return { title: meta.title, description: meta.description };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }) {
  if (!getPostSlugs().includes(params.slug)) return notFound();
  const post = await getPost(params.slug);
  const cat = categoryBySlug(post.category);

  return (
    <article className="container article">
      {cat && (
        <Link className="eyebrow" href={`/category/${cat.slug}`}>
          {cat.name}
        </Link>
      )}
      <h1>{post.title}</h1>
      <p className="disclosure">
        This post contains affiliate links. If you buy through them, we may earn
        a small commission at no cost to you.
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      <div className="disclaimer">
        Prices and availability change — please confirm current details on the
        retailer’s site before buying.
      </div>
      <p style={{ marginTop: 24 }}>
        <Link href="/">← Back to all guides</Link>
      </p>
    </article>
  );
}
