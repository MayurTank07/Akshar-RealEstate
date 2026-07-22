import { API_BASE_URL, publicApi } from "../services/api";

const CAMPAIGN_KEY = "akshar_campaign_attribution";
const TRACKED_EVENTS = new Set([
  "property_page_view",
  "search_performed",
  "location_selected",
  "filter_applied",
  "property_image_opened",
  "call_button_clicked",
  "whatsapp_button_clicked",
  "inquiry_form_opened",
  "inquiry_form_submitted",
  "supervisor_contacted",
  "property_shared",
  "map_opened",
]);
const CAMPAIGN_PARAMS = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
  gclid: "gclid",
  fbclid: "fbclid",
  ref: "ref",
  source: "ref",
  supervisor: "supervisor",
  supervisorId: "supervisor",
};

function readStoredCampaign() {
  try {
    return JSON.parse(localStorage.getItem(CAMPAIGN_KEY) || "{}");
  } catch {
    return {};
  }
}

export function captureCampaignFromUrl() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const campaign = { ...readStoredCampaign() };
  Object.entries(CAMPAIGN_PARAMS).forEach(([param, key]) => {
    const value = params.get(param);
    if (value) campaign[key] = value.slice(0, 180);
  });
  if (Object.keys(campaign).length) {
    campaign.capturedAt = new Date().toISOString();
    try {
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign));
    } catch {
      // Campaign attribution is useful, but it should never block rendering.
    }
  }
  return campaign;
}

function safeString(value, limit = 180) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

export function analyticsPropertyContext(property = {}) {
  const broker = property?.broker || {};
  return {
    propertyId: /^[a-f\d]{24}$/i.test(property?._id || "") ? property._id : undefined,
    propertySlug: property?.slug || "",
    propertyTitle: property?.title || property?.seoTitle || "",
    location: property?.locationMaster?.name || property?.location || property?.map?.area || "",
    city: property?.city || property?.map?.city || "",
    propertyType: property?.type || property?.propertyType || "",
    bhk: Number(property?.bhk || property?.beds || 0),
    listingType: property?.listingType || property?.dealType || "",
    assignedSupervisor: {
      id: broker.id || "",
      name: broker.name || "",
      companyName: broker.companyName || "",
    },
  };
}

function cleanPayload(eventName, payload = {}) {
  const campaign = { ...readStoredCampaign(), ...(payload.campaign || {}) };
  return {
    eventName,
    propertyId: payload.propertyId,
    propertySlug: safeString(payload.propertySlug || payload.slug),
    propertyTitle: safeString(payload.propertyTitle),
    location: safeString(payload.location),
    city: safeString(payload.city),
    propertyType: safeString(payload.propertyType),
    bhk: Number(payload.bhk || 0),
    listingType: safeString(payload.listingType),
    assignedSupervisor: {
      id: safeString(payload.assignedSupervisor?.id, 80),
      name: safeString(payload.assignedSupervisor?.name),
      companyName: safeString(payload.assignedSupervisor?.companyName),
    },
    pagePath: typeof window !== "undefined" ? safeString(`${window.location.pathname}${window.location.search}`, 300) : "",
    pageTitle: typeof document !== "undefined" ? safeString(document.title) : "",
    referrer: typeof document !== "undefined" ? safeString(document.referrer, 300) : "",
    source: safeString(payload.source || campaign.utmSource || campaign.ref),
    campaign,
    metadata: payload.metadata || {},
  };
}

export function trackAnalyticsEvent(eventName, payload = {}) {
  if (!TRACKED_EVENTS.has(eventName) || typeof window === "undefined") return;
  const body = cleanPayload(eventName, payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: "application/json" });
    if (navigator.sendBeacon(`${API_BASE_URL}/public/analytics/events`, blob)) return;
  }
  publicApi.trackAnalyticsEvent(body).catch(() => {});
}

export function trackPropertyEvent(eventName, property, metadata = {}) {
  trackAnalyticsEvent(eventName, {
    ...analyticsPropertyContext(property),
    metadata,
  });
}
