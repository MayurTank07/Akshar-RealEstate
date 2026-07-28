import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Future founder-image redesign: restore BrandLogo import when reusing the commented layout below.
// import BrandLogo from '../components/BrandLogo';
import Breadcrumbs from '../components/Breadcrumbs';
import CertificationsSection from '../components/CertificationsSection';
import StructuredData from '../components/StructuredData';
import useSiteContent from '../hooks/useSiteContent';
import { defaultAboutContent } from '../config/navigationContent';
import { buildBusinessSchemas } from '../utils/structuredData';
import { responsiveImageProps } from '../utils/imageSeo';

const AboutUs = () => {
  const navigate = useNavigate();
  const siteContent = useSiteContent();
  const about = { ...defaultAboutContent, ...(siteContent.aboutContent || {}) };
  // Founder image support is intentionally paused for the current text-only founder section.
  // Keep this reference for the future founder-image redesign:
  // const ownerImageUrl = siteContent.isLoaded ? String(siteContent.aboutContent?.ownerPhoto || '').trim() : '';
  const stats = Array.isArray(about.stats) && about.stats.length ? about.stats : defaultAboutContent.stats;
  const features = Array.isArray(about.features) && about.features.length ? about.features : defaultAboutContent.features;
  const schema = useMemo(
    () => buildBusinessSchemas({ path: '/about', pageName: 'About Akshar Estate', contact: siteContent.contactContent }),
    [siteContent.contactContent]
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <StructuredData id="about-business" schema={schema} />
      <Navbar />

      {/* Back Arrow Section - Pushed down so it's visible below fixed Navbar */}
      <div className="pt-32 px-6 max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} className="mb-5" />
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-200 group-hover:border-blue-600 group-hover:bg-blue-50 transition-all">
            <span className="text-lg">←</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Home</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="md:w-2/3">
            <div className="mb-6 inline-flex rounded-full border border-blue-100 bg-blue-50 px-5 py-2.5 text-sm font-black uppercase tracking-[0.18em] text-blue-700 shadow-sm sm:text-base">
              Since 2006
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
              {about.title?.includes("Akshar Estate") ? (
                <>
                  {about.title.split("Akshar Estate")[0]}<span className="font-semibold text-blue-600">Akshar Estate{about.title.split("Akshar Estate").slice(1).join("Akshar Estate")}</span>
                </>
              ) : about.title}
            </h1>
          </div>
          <div className="md:w-1/3 pb-2 border-l-2 border-blue-600 pl-6">
            <p className="text-slate-500 text-lg leading-relaxed">
              {about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="h-[500px] w-full bg-slate-200 rounded-2xl overflow-hidden relative group">
          <img 
            {...responsiveImageProps(about.heroImage, {
              alt: "Akshar Estate The Property HUB office",
              width: 1600,
              height: 900,
              widths: [640, 960, 1280, 1600],
              sizes: "(max-width: 768px) 100vw, 1120px",
              loading: "eager",
              fetchPriority: "high",
              className: "h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105",
            })}
          />
          <div className="absolute bottom-10 left-10 bg-white p-8 rounded-xl shadow-2xl hidden md:block">
            <div className="flex gap-12 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">Since 2006</p>
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Established</p>
              </div>
              {stats.slice(0, 2).map((item, index) => (
                <div key={`${item.label}-${index}`}>
                  <p className="text-3xl font-bold text-slate-900">{item.value}</p>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold mb-4">{about.visionTitle}</h2>
          <p className="text-3xl font-medium leading-snug">{about.visionContent}</p>
        </div>
        <div className="flex flex-col justify-end text-slate-600 text-lg">
          <p>{about.mainDescription}</p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-semibold mb-16 tracking-tight">Why Choose Akshar Estate The Property HUB</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <div key={index} className="group p-8 bg-white rounded-xl shadow-sm border border-transparent hover:border-blue-100 hover:shadow-md transition-all duration-300">
                <div className="h-1 w-12 bg-blue-600 mb-6 group-hover:w-full transition-all duration-500"></div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 sm:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Future founder-image redesign reference:
              The previous section displayed BrandLogo, OwnerProfileImage, owner designation,
              and owner bio in a two-column layout. Restore/adapt this block when the founder
              image is ready:

              <div className="mb-12 flex items-center gap-3">
                <BrandLogo />
              </div>
              <div className="flex flex-col md:flex-row gap-16 items-center">
                <div className="md:w-1/2">
                  <OwnerProfileImage
                    src={ownerImageUrl}
                    alt={`${about.ownerName}, ${about.ownerDesignation}`}
                    isContentLoaded={siteContent.isLoaded}
                  />
                </div>
                <div className="md:w-1/2">
                  <h2 className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold mb-4">Our Leadership</h2>
                  <h3 className="text-4xl font-bold mb-2">{about.ownerName}</h3>
                  <p className="mb-6 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-400">
                    {about.ownerDesignation}
                  </p>
                  <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                    {about.ownerBio}
                  </p>
                  <div className="bg-slate-900 text-white p-8 rounded-tr-[50px] shadow-xl">
                    <p className="italic text-xl">"{about.ownerQuote}"</p>
                    <p className="mt-4 font-bold text-blue-400">— {about.ownerName}</p>
                  </div>
                </div>
              </div>
          */}

          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-10 sm:py-16 lg:px-16">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-600" aria-hidden="true" />
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                {about.ownerName}
              </h2>
              <blockquote className="mt-8 border-y border-slate-100 py-8 sm:mt-10 sm:py-10">
                <p className="text-xl font-medium leading-relaxed text-slate-700 sm:text-2xl">
                  "{about.ownerQuote}"
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold mb-4">{about.missionTitle}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">{about.missionContent}</p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h2 className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold mb-4">{about.storyTitle}</h2>
          <p className="text-slate-600 text-lg leading-relaxed">{about.storyContent}</p>
        </div>
      </section>

      <CertificationsSection />

      <Footer />
    </div>
  );
};

/* Future founder-image redesign reference:
   These helpers powered the previous founder image block. They are intentionally commented
   out while the current section remains text-only, so they can be reused when the founder
   image is added back.

function OwnerImageSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-slate-100" data-owner-image-skeleton="true">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-[owner-shimmer_1.4s_ease-in-out_infinite]" />
      <div className="absolute inset-x-10 bottom-10 h-3 rounded-full bg-white/60" />
      <div className="absolute inset-x-16 bottom-16 h-3 rounded-full bg-white/50" />
    </div>
  );
}

function OwnerImagePlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-slate-100" data-owner-image-placeholder="true">
      <div className="h-20 w-20 rounded-full border border-slate-200 bg-white shadow-sm" />
    </div>
  );
}

function OwnerProfileImage({ src, alt, isContentLoaded }) {
  const [imageState, setImageState] = useState({ src: '', loaded: false, error: false });

  useEffect(() => {
    if (!src) return undefined;

    let active = true;
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      if (active) setImageState({ src, loaded: true, error: false });
    };
    image.onerror = () => {
      if (active) setImageState({ src, loaded: false, error: true });
    };
    image.src = src;

    return () => {
      active = false;
    };
  }, [src]);

  const isImageLoaded = imageState.src === src && imageState.loaded;
  const imageError = imageState.src === src && imageState.error;
  const showSkeleton = !isContentLoaded || (src && !isImageLoaded && !imageError);
  const showPlaceholder = isContentLoaded && (!src || imageError);

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
      {showSkeleton && <OwnerImageSkeleton />}
      {showPlaceholder && <OwnerImagePlaceholder />}
      {src && !imageError && (
        <img
          {...responsiveImageProps(src, {
            alt,
            width: 900,
            height: 1125,
            widths: [420, 640, 900],
            sizes: "(max-width: 768px) 100vw, 50vw",
            loading: "eager",
            fetchPriority: "high",
            className: `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`,
          })}
          onLoad={() => setImageState({ src, loaded: true, error: false })}
          onError={() => setImageState({ src, loaded: false, error: true })}
        />
      )}
    </div>
  );
}
*/

export default AboutUs;
