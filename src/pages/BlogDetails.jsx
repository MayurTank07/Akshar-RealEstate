import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import StructuredData from "../components/StructuredData";
import { publicApi } from "../services/api";
import { buildBlogPostingJsonLd, buildBreadcrumbSchema } from "../utils/structuredData";
import { slugifyLocation } from "../config/locationLandingPages";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function locationHref(name) {
  const slug = slugifyLocation(name);
  if (["gandhinagar"].includes(slug)) return "/properties-for-sale/gandhinagar";
  if (["ahmedabad"].includes(slug)) return "/properties-for-sale/ahmedabad";
  if (["kudasan", "sargasan", "vavol", "pethapur", "gift-city"].includes(slug)) return `/properties-for-sale/gandhinagar/${slug}`;
  return `/properties-for-sale/ahmedabad/${slug}`;
}

export default function BlogDetails() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let active = true;
    publicApi.blog(slug)
      .then((response) => {
        if (active) setBlog(response.data);
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

  const crumbs = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "Property Guides", href: "/blog" },
    blog && { label: blog.title },
  ], [blog]);

  if (loading) return <div className="min-h-screen bg-slate-50 pt-32 text-center text-sm font-bold text-slate-500">Loading property guide...</div>;
  if (missing || !blog) return <Navigate to="/blog" replace />;

  const url = `https://www.aksharestate.in/blog/${blog.slug}`;
  const schema = [
    buildBreadcrumbSchema(crumbs.map((item) => ({ label: item.label, href: item.href || `/blog/${blog.slug}` }))),
    buildBlogPostingJsonLd(blog, { url }),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <StructuredData id="blog-details-schema" schema={schema} />
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <Breadcrumbs items={crumbs} className="mb-6" />
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <header>
            {blog.category && <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">{blog.category}</p>}
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">{blog.title}</h1>
            <p className="mt-4 text-sm font-bold text-slate-500">
              {blog.author} {formatDate(blog.publishedAt) && `| ${formatDate(blog.publishedAt)}`}
            </p>
            {blog.excerpt && <p className="mt-5 text-lg font-semibold leading-8 text-slate-600">{blog.excerpt}</p>}
          </header>
          {blog.featuredImage && (
            <img src={blog.featuredImage} alt={`${blog.title} featured image`} className="mt-8 aspect-[16/9] w-full rounded-lg object-cover" loading="eager" />
          )}
          <div className="prose prose-slate mt-8 max-w-none whitespace-pre-line text-base font-medium leading-8 text-slate-700">
            {blog.body}
          </div>
          {blog.relatedLocations?.length > 0 && (
            <section className="mt-10 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-extrabold text-slate-950">Related Property Locations</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {blog.relatedLocations.map((name) => (
                  <Link key={name} to={locationHref(name)} className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-700 transition hover:bg-blue-100">
                    Properties for sale in {name}
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
