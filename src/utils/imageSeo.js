export const PROPERTY_IMAGE_FALLBACK = "https://placehold.co/1200x800/f8fafc/475569?text=No+Property+Image";
export const THUMBNAIL_IMAGE_FALLBACK = "https://placehold.co/420x300/f8fafc/475569?text=Property";

const DEFAULT_WIDTHS = [480, 768, 1024, 1360, 1600];

export function propertyImageAlt(property, index = 0) {
  const savedAlt = property?.imageAltTexts?.[index];
  const repeatedAlt = savedAlt && property?.imageAltTexts?.filter((item) => item === savedAlt).length > 1;
  if (savedAlt && !repeatedAlt) return savedAlt;
  const location = [property?.locationMaster?.name || property?.location, property?.city].filter(Boolean).join(" ");
  const type = property?.bhk ? `${property.bhk} BHK ${property?.type || property?.propertyType || "property"}` : property?.type || property?.propertyType || "property";
  const views = ["Exterior view", "Living room", "Bedroom", "Kitchen", "Balcony", "Interior view", "Entrance view", "Floor plan"];
  return `${views[index % views.length]} of ${type} in ${location || "Gujarat"}`;
}

export function propertyImageUrl(property, index = 0, fallback = PROPERTY_IMAGE_FALLBACK) {
  const images = [property?.image, ...(property?.gallery || []), ...(property?.images || [])].filter(Boolean);
  return Array.from(new Set(images))[index] || fallback;
}

function cloudinaryUrl(url, { width, height, crop = "fill", gravity = "auto", quality = "auto", format = "auto" } = {}) {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return "";
  const transforms = [
    format && `f_${format}`,
    quality && `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    gravity && crop === "fill" && `g_${gravity}`,
  ].filter(Boolean).join(",");
  if (!transforms) return url;
  return url.replace("/upload/", `/upload/${transforms}/`);
}

function unsplashUrl(url, { width, height, quality = 80 } = {}) {
  if (!url.includes("images.unsplash.com")) return "";
  try {
    const next = new URL(url);
    next.searchParams.set("auto", "format");
    next.searchParams.set("fit", "crop");
    if (width) next.searchParams.set("w", String(width));
    if (height) next.searchParams.set("h", String(height));
    next.searchParams.set("q", String(quality));
    return next.toString();
  } catch {
    return "";
  }
}

export function optimizedImageUrl(url, options = {}) {
  const source = String(url || "").trim() || options.fallback || PROPERTY_IMAGE_FALLBACK;
  return cloudinaryUrl(source, options) || unsplashUrl(source, options) || source;
}

export function imageSrcSet(url, options = {}) {
  const widths = options.widths || DEFAULT_WIDTHS;
  return widths
    .map((width) => `${optimizedImageUrl(url, { ...options, width, height: options.aspectRatio && Math.round(width / options.aspectRatio) })} ${width}w`)
    .join(", ");
}

export function responsiveImageProps(url, {
  alt,
  width = 1200,
  height = 800,
  widths = DEFAULT_WIDTHS,
  sizes = "100vw",
  loading = "lazy",
  fetchPriority,
  decoding = "async",
  fallback = PROPERTY_IMAGE_FALLBACK,
  crop = "fill",
  className = "",
} = {}) {
  const aspectRatio = width && height ? width / height : undefined;
  const source = url || fallback;
  return {
    src: optimizedImageUrl(source, { width, height, crop, fallback }),
    srcSet: imageSrcSet(source, { widths, aspectRatio, crop, fallback }),
    sizes,
    width,
    height,
    loading,
    decoding,
    fetchPriority,
    alt: alt || "Akshar Estate property image",
    className,
    onError: (event) => {
      if (event.currentTarget.dataset.fallbackApplied === "true") return;
      event.currentTarget.dataset.fallbackApplied = "true";
      event.currentTarget.src = fallback;
      event.currentTarget.removeAttribute("srcset");
    },
  };
}
