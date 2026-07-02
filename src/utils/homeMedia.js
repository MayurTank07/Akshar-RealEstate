const homeMediaFallbacks = {
  video: ["/home-video-1.svg", "/home-video-2.svg", "/home-video-3.svg", "/home-video-4.svg"],
  agent: ["/home-agent-1.svg", "/home-agent-2.svg"],
  testimonial: ["/home-testimonial-1.svg", "/home-testimonial-2.svg", "/home-testimonial-3.svg", "/home-testimonial-4.svg", "/home-testimonial-5.svg", "/home-testimonial-6.svg"],
};

const legacyPatterns = {
  video: /^\/v\d+\.jpg$/i,
  agent: /^\/a\d+\.jpg$/i,
  testimonial: /^\/t\d+\.jpg$/i,
};

export function resolveHomeMedia(src, type, index = 0) {
  const fallbacks = homeMediaFallbacks[type] || [];
  if (!fallbacks.length) return src || "";
  if (!src || legacyPatterns[type]?.test(src)) return fallbacks[index % fallbacks.length];
  return src;
}

export function fallbackHomeMedia(type, index = 0) {
  const fallbacks = homeMediaFallbacks[type] || [];
  return fallbacks[index % fallbacks.length] || "";
}
