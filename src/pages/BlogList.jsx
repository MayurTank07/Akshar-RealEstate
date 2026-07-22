import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { publicApi } from "../services/api";

function formatDate(value) {
  if (!value) return "Draft date pending";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Draft date pending";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    publicApi.blogs({ limit: 24 })
      .then((response) => {
        if (active) setBlogs(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => {
        if (active) setBlogs([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Property Guides" }]} className="mb-6" />
        <header className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Akshar Estate Insights</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Property Guides</h1>
          <p className="mt-3 max-w-3xl text-base font-semibold leading-7 text-slate-600">
            Buyer-focused guides from Akshar Estate for Gandhinagar, Ahmedabad and priority localities.
          </p>
        </header>
        {loading && <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500">Loading property guides...</p>}
        {!loading && blogs.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-extrabold text-slate-950">Property guides are being prepared</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">Published, indexable guides will appear here after admin review.</p>
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog._id || blog.slug} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              {blog.category && <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">{blog.category}</p>}
              <h2 className="mt-3 text-xl font-extrabold leading-snug text-slate-950">
                <Link to={`/blog/${blog.slug}`} className="transition hover:text-blue-700">
                  {blog.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{blog.excerpt}</p>
              <p className="mt-4 text-xs font-bold text-slate-400">Published {formatDate(blog.publishedAt)}</p>
              <Link to={`/blog/${blog.slug}`} className="mt-5 inline-flex text-sm font-extrabold text-blue-700 transition hover:text-blue-900">
                {blog.title}
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
