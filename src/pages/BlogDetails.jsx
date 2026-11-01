import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StructuredData from "../components/StructuredData";
import { publicApi } from "../services/api";
import { buildBlogPostingJsonLd, buildBreadcrumbSchema } from "../utils/structuredData";
import { activeBlogLocationLinks, isEditoriallyIndexableBlog, isMeaningfulBlogDate, relevantPropertyLinksForBlog } from "../utils/blogEditorial";
import { getSeoGuide } from "../config/seoGuides";

function formatDate(value) {
  if (!isMeaningfulBlogDate(value)) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function BlogDetails() {
  const { slug } = useParams();
  const guide = getSeoGuide(slug);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    if (getSeoGuide(slug)) return () => { active = false; };
    publicApi.blog(slug)
      .then((response) => {
        if (active) {
          if (isEditoriallyIndexableBlog(response.data)) setBlog(response.data);
          else setMissing(true);
        }
      })
      .catch(() => {
        if (active) setMissing(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const selectedBlog = guide || blog;
  const crumbs = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "Property Guides", href: "/blog" },
    selectedBlog && { label: selectedBlog.title },
  ], [selectedBlog]);

  if (loading && !guide) return <div className="min-h-screen bg-slate-50 pt-32 text-center text-sm font-bold text-slate-500">Loading property guide...</div>;
  if ((missing && !guide) || !selectedBlog) return <Navigate to="/blog" replace />;

  const url = `https://www.aksharestate.in/blog/${selectedBlog.slug}`;
  const schema = [
    buildBreadcrumbSchema(crumbs.map((item) => ({ label: item.label, href: item.href || `/blog/${selectedBlog.slug}` }))),
    buildBlogPostingJsonLd(selectedBlog, { url }),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <StructuredData id="blog-details-schema" schema={schema} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <header>
            {selectedBlog.category && <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">{selectedBlog.category}</p>}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{selectedBlog.title}</h1>
            <p className="mt-4 text-sm font-bold text-slate-500">
              {selectedBlog.author} {formatDate(selectedBlog.publishedAt) && `| ${formatDate(selectedBlog.publishedAt)}`}
            </p>
            {selectedBlog.excerpt && <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">{selectedBlog.excerpt}</p>}
          </header>
          {selectedBlog.featuredImage && (
            <img src={selectedBlog.featuredImage} alt={`${selectedBlog.title} featured image`} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" loading="eager" />
          )}
          {selectedBlog.sections ? <div className="mt-8 space-y-7 text-base font-medium leading-8 text-slate-700">{selectedBlog.sections.map((section) => <section key={section.heading}><h2 className="text-xl font-extrabold text-slate-950">{section.heading}</h2><p className="mt-2">{section.text}</p></section>)}</div> : <div className="prose prose-slate mt-8 max-w-none whitespace-pre-line text-base font-medium leading-8 text-slate-700">{selectedBlog.body}</div>}
          {selectedBlog.faqs && <section className="mt-10 border-t border-slate-200 pt-6"><h2 className="text-xl font-extrabold text-slate-950">Common Questions</h2>{selectedBlog.faqs.map(([question, answer]) => <details key={question} className="mt-4 rounded-lg border border-slate-200 p-4"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-2 text-slate-700">{answer}</p></details>)}</section>}
          {relevantPropertyLinksForBlog(selectedBlog).length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-extrabold text-slate-950">Explore Active Property Pages</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relevantPropertyLinksForBlog(selectedBlog).map(([label, href]) => (
                  <Link key={href} to={href} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-700 transition hover:bg-blue-100">{label}</Link>
                ))}
              </div>
            </section>
          )}
          {activeBlogLocationLinks(selectedBlog).length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-extrabold text-slate-950">Related Property Locations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeBlogLocationLinks(selectedBlog).map(([label, href]) => (
                  <Link key={href} to={href} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-700 transition hover:bg-blue-100">
                    {label}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
