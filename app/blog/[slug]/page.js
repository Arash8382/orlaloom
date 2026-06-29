import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryBySlug } from "../../../lib/site";
import { getPostSlugs, getPost, getPostMeta, getPostsByCategory } from "../../../lib/posts";
import { CategoryArt } from "../../components/Art";

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
  const related = getPostsByCategory(post.category).filter((p) => p.slug !== post.slug).slice(0, 3);
  const dateStr = new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <article className="narrow">
      <div className="breadcrumb">
        <Link href="/">Home</Link> &nbsp;/&nbsp;{" "}
        {cat && <><Link href={`/category/${cat.slug}`}>{cat.name}</Link> &nbsp;/&nbsp;{" "}</>}
        <span style={{ color: "var(--ink)" }}>{post.title}</span>
      </div>

      <header className="article-head">
        {cat && <Link className="eyebrow" href={`/category/${cat.slug}`}>{cat.name}</Link>}
        <h1>{post.title}</h1>
        <div className="byline">
          <span className="avatar">OL</span>
          <span>By the Orla Loom editors · {dateStr} · Independently curated</span>
        </div>
      </header>

      <div className={`article-hero tint-${post.category}`}><CategoryArt slug={post.category} /></div>

      <p className="disclosure">
        This post contains affiliate links. If you buy through them, we may earn a small commission at no cost to you.
      </p>

      <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      <div className="callout">
        Prices and availability change quickly — please confirm current details on the retailer’s site before buying.
      </div>

      {related.length > 0 && (
        <div className="related">
          <span className="eyebrow">Keep reading</span>
          <div className="posts" style={{ marginTop: 16 }}>
            {related.map((p) => (
              <Link className="post-card" href={`/blog/${p.slug}`} key={p.slug}>
                <div className={`thumb tint-${p.category}`}><CategoryArt slug={p.category} /></div>
                <div className="pc-body">
                  <span className="pc-tag">{cat ? cat.name : "Guide"}</span>
                  <h3>{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
