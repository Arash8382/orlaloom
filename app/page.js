import Link from "next/link";
import { site, categories, categoryBySlug } from "../lib/site";
import { getAllPosts } from "../lib/posts";
import { CategoryArt, ValueIcon, Arrow } from "./components/Art";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);
  const heroSlugs = ["butter-dishes", "scalloped-dinnerware", "candles", "glassware"];

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Curated for 2026</span>
            <h1>The prettiest finds for a warm, characterful home.</h1>
            <p className="lead">
              Hand-picked butter dishes, scalloped dinnerware, candles, and colored
              glassware — vetted, styled, and explained so you buy with confidence.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-accent" href="/category/butter-dishes">
                Shop butter dishes <Arrow />
              </Link>
              <Link className="btn btn-ghost" href="/category/cottagecore-kitchen">
                Browse all guides
              </Link>
            </div>
            <div className="hero-trust">
              <span><i className="dot" /> Independently curated</span>
              <span><i className="dot" /> Honest picks, real reasons</span>
              <span><i className="dot" /> Updated for 2026</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            {heroSlugs.map((s) => (
              <div className="hero-tile" key={s}><CategoryArt slug={s} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE BAR */}
      <section className="valuebar">
        <div className="container row">
          <div className="v">
            <ValueIcon name="hand" />
            <div><b>Hand-picked, not scraped</b><p>Every product is chosen by us for how it actually looks and holds up on a real table.</p></div>
          </div>
          <div className="v">
            <ValueIcon name="check" />
            <div><b>Honest, useful guidance</b><p>Each pick comes with who it’s for, the standout detail, and an honest caveat.</p></div>
          </div>
          <div className="v">
            <ValueIcon name="refresh" />
            <div><b>Kept current</b><p>We refresh our guides as trends move and as new finds sell out or restock.</p></div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Shop by category</span>
            <h2>Find your next favorite thing</h2>
            <p>Five edits at the heart of the warm, vintage, cottagecore home.</p>
          </div>
          <div className="cards">
            {categories.map((c) => (
              <Link className="card" href={`/category/${c.slug}`} key={c.slug}>
                <div className={`card-art tint-${c.slug}`}><CategoryArt slug={c.slug} /></div>
                <div className="card-body">
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <span className="card-link">Explore <Arrow /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE PICK */}
      <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Why trust Orla Loom</span>
            <h2>How every pick earns its place</h2>
            <p>No sponsored placements, no endless lists of whatever’s in stock. Just a simple, honest process.</p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="num">1</span>
              <h3>We research the trend</h3>
              <p>We track what people are actually searching for and buying — then find the pieces that define the look.</p>
            </div>
            <div className="step">
              <span className="num">2</span>
              <h3>We vet each piece</h3>
              <p>Material, size, value, and how it photographs on a real table. If it wouldn’t earn a spot in our own kitchen, it’s out.</p>
            </div>
            <div className="step">
              <span className="num">3</span>
              <h3>We tell you the truth</h3>
              <p>Who it’s best for, the detail that makes it special, and the one thing to watch before you buy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST GUIDES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Fresh from the journal</span>
            <h2>Latest guides</h2>
          </div>
          <div className="posts">
            {posts.map((p) => {
              const cat = categoryBySlug(p.category);
              return (
                <Link className="post-card" href={`/blog/${p.slug}`} key={p.slug}>
                  <div className={`thumb tint-${p.category}`}><CategoryArt slug={p.category} /></div>
                  <div className="pc-body">
                    <span className="pc-tag">{cat ? cat.name : "Guide"}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="band">
        <div className="container band-inner">
          <div>
            <span className="eyebrow">The weekly find</span>
            <h2>One beautiful thing in your inbox each week.</h2>
            <p>Get our newest finds and seasonal tablescapes before they sell out. No spam, unsubscribe anytime.</p>
          </div>
          <div>
            <form className="subform" action="#" method="post">
              <input type="email" placeholder="you@email.com" aria-label="Email address" />
              <button className="btn btn-accent" type="submit">Subscribe</button>
            </form>
            <small>Join readers building a warmer home, one find at a time.</small>
          </div>
        </div>
      </section>
    </>
  );
}
