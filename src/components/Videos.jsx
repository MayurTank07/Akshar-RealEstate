import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useSiteContent from "../hooks/useSiteContent";
import { defaultHomeSectionsContent } from "../config/navigationContent";
import { fallbackHomeMedia, resolveHomeMedia } from "../utils/homeMedia";

function youtubeVideoId(url = "") {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || "";
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parsed.pathname.startsWith("/embed/")) return parts.at(-1) || "";
      return parsed.searchParams.get("v") || parts.at(-1) || "";
    }
  } catch {
    return "";
  }
  return "";
}

function youtubeEmbedUrl(url = "") {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : "";
}

function youtubeThumbnailUrl(url = "") {
  const id = youtubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}

function isUploadedVideo(item = {}) {
  if (item.videoType === "upload" || item.storage === "local" || item.filePath) return true;
  try {
    return new URL(item.url).pathname.startsWith("/uploads/videos/");
  } catch {
    return String(item.url || "").startsWith("/uploads/videos/");
  }
}

function UploadedVideoThumb({ src, title }) {
  const videoRef = useRef(null);
  const [readySrc, setReadySrc] = useState("");
  const isReady = readySrc === src;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const showFirstFrame = () => {
      try {
        if (Number.isFinite(video.duration) && video.duration > 0.15) {
          video.currentTime = 0.12;
        }
      } catch {
        // Some browsers block seeking before enough data is available.
      }
    };
    const markReady = () => setReadySrc(src);

    video.addEventListener("loadedmetadata", showFirstFrame);
    video.addEventListener("loadeddata", markReady);

    return () => {
      video.removeEventListener("loadedmetadata", showFirstFrame);
      video.removeEventListener("loadeddata", markReady);
    };
  }, [src]);

  return (
    <>
      {!isReady && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.26),transparent_36%),linear-gradient(135deg,#020617,#111827_48%,#0f766e)]" />
      )}
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={title || "Uploaded video preview"}
        className={`pointer-events-none h-full w-full bg-slate-950 object-contain transition duration-300 ${isReady ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}

export default function Videos() {
  const carouselRef = useRef(null);
  const [scrollState, setScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const [activeVideo, setActiveVideo] = useState(null);
  const { homeSectionsContent } = useSiteContent();
  const section = { ...defaultHomeSectionsContent.videos, ...(homeSectionsContent?.videos || {}) };
  const videos = (Array.isArray(section.items) ? section.items : defaultHomeSectionsContent.videos.items).filter((item) => item.enabled !== false);

  const updateScrollState = useCallback(() => {
    const track = carouselRef.current;
    if (!track) return;
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    setScrollState({
      canScrollLeft: track.scrollLeft > 4,
      canScrollRight: track.scrollLeft < maxScrollLeft - 4,
    });
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = carouselRef.current;
    if (!track) return undefined;

    const onScroll = () => window.requestAnimationFrame(updateScrollState);
    const onResize = () => window.requestAnimationFrame(updateScrollState);
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateScrollState, videos.length]);

  useEffect(() => {
    if (!activeVideo) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setActiveVideo(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeVideo]);

  const scrollCarousel = (direction) => {
    const track = carouselRef.current;
    if (!track) return;
    const firstCard = track.querySelector("[data-video-card]");
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "24") || 24;
    const cardStep = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.85;
    const distance = Math.max(cardStep, track.clientWidth * 0.78);
    const maxScrollLeft = Math.max(0, track.scrollWidth - track.clientWidth);
    const nextLeft = Math.min(maxScrollLeft, Math.max(0, track.scrollLeft + direction * distance));
    track.scrollTo({ left: nextLeft, behavior: "smooth" });
    window.setTimeout(updateScrollState, 420);
  };

  if (!videos.length) return null;

  return (
    <>
    <section className="w-full overflow-hidden bg-slate-100 py-14 sm:py-16">

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8 xl:max-w-[1500px]">
        {section.eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
            {section.eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          {section.title}
        </h2>
        <p className="text-gray-500 mt-2">
          {section.subtitle}
        </p>
      </div>

      {/* Video Carousel */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-[1500px]">
        <div
          ref={carouselRef}
          className="akshar-video-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5 md:gap-6"
          onScroll={updateScrollState}
        >

        {videos.map((v, i) => {
          const image = resolveHomeMedia(v.image, "video", i);
          const uploadedVideo = isUploadedVideo(v);
          const youtubeUrl = uploadedVideo ? "" : youtubeEmbedUrl(v.url);
          const youtubeThumb = uploadedVideo ? "" : youtubeThumbnailUrl(v.url);
          const hasPlayableVideo = Boolean((uploadedVideo && v.url) || youtubeUrl);
          const openVideo = () => {
            if (!hasPlayableVideo) return;
            setActiveVideo({ ...v, uploadedVideo, youtubeUrl, image });
          };
          return (
          <article key={`${v.title || "video"}-${v.url || i}`} data-video-card className="w-[78vw] flex-none snap-start sm:w-[21rem] md:w-[23rem] lg:w-[24rem] xl:w-[26rem]">

            {/* Video Card */}
            {hasPlayableVideo ? (
              <button
                type="button"
                onClick={openVideo}
                className="akshar-video-frame group relative block aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-[1.35rem] bg-slate-950 text-left shadow-[0_20px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.24)]"
                aria-label={`Play ${v.title || "video"}`}
              >
                {uploadedVideo ? (
                  <UploadedVideoThumb src={v.url} title={v.title} />
                ) : (
                  <img
                    src={youtubeThumb || image}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(event) => { event.currentTarget.src = image || fallbackHomeMedia("video", i); }}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/12 to-transparent opacity-95 transition group-hover:opacity-100" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white text-blue-600 shadow-xl ring-[18px] ring-white/20 transition duration-300 group-hover:scale-110">
                    <Play size={24} fill="currentColor" />
                  </span>
                </div>
                {v.overlay && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-sm font-semibold text-white">
                      {v.overlay}
                    </p>
                    {v.button && (
                      <span className="mt-2 inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                        {v.button}
                      </span>
                    )}
                  </div>
                )}
              </button>
            ) : (
            <div className="akshar-video-frame relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5 transition duration-300 group hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.24)]">

              <img
                src={image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(event) => { event.currentTarget.src = fallbackHomeMedia("video", i); }}
              />

              <div className="absolute inset-0 bg-black/40" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer">
                  <Play size={22} />
                </div>
              </div>

              {/* Text Overlay */}
              {v.overlay && (
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium text-sm">
                    {v.overlay}
                  </p>
                  {v.button && (
                    <button className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-medium hover:bg-blue-700 transition">
                      {v.button}
                    </button>
                  )}
                </div>
              )}

            </div>
            )}

            {/* Info */}
            <div className="mt-3">
              <h3 className="line-clamp-1 text-lg font-semibold text-slate-950">
                {v.title}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                {v.location}
              </p>
            </div>

          </article>
        );
        })}

        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="mt-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollCarousel(-1)}
          disabled={!scrollState.canScrollLeft}
          className="grid h-12 w-12 place-items-center rounded-full border border-slate-300 bg-white text-slate-500 shadow-sm transition hover:border-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300 disabled:hover:text-slate-500"
          aria-label="Scroll videos left"
        >
          <ChevronLeft size={21} />
        </button>
        <button
          type="button"
          onClick={() => scrollCarousel(1)}
          disabled={!scrollState.canScrollRight}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-blue-600 bg-white text-blue-600 shadow-sm transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:opacity-35 disabled:hover:bg-white"
          aria-label="Scroll videos right"
        >
          <ChevronRight size={21} />
        </button>
      </div>

    </section>
    {activeVideo && (
      <div className="fixed inset-0 z-[700] grid place-items-center bg-slate-950/85 p-4 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
        <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
          <div className="mb-3 flex items-center justify-between gap-4 text-white">
            <div>
              <h3 className="text-lg font-bold sm:text-xl">{activeVideo.title || "Akshar Estate Video"}</h3>
              {activeVideo.location && <p className="text-sm font-medium text-white/70">{activeVideo.location}</p>}
            </div>
            <button
              type="button"
              onClick={() => setActiveVideo(null)}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Close video"
            >
              <X size={22} />
            </button>
          </div>
          <div className="akshar-video-player overflow-hidden rounded-2xl bg-black shadow-2xl">
            {activeVideo.uploadedVideo ? (
              <video
                src={activeVideo.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="max-h-[78vh] w-full bg-black object-contain"
              />
            ) : (
              <iframe
                title={activeVideo.title || "Akshar Estate video"}
                src={`${activeVideo.youtubeUrl}${activeVideo.youtubeUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0`}
                className="aspect-video max-h-[78vh] w-full bg-black"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
