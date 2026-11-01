const INTERNAL_DRAFT_MARKER = /^\s*this draft is intended for the akshar estate content team\b/i;

export function isEditoriallyIndexableBlog(blog = {}) {
  return Boolean(
    blog.slug &&
    blog.isIndexable !== false &&
    !blog.deletedAt &&
    String(blog.status || "").toLowerCase() !== "draft" &&
    !INTERNAL_DRAFT_MARKER.test(String(blog.body || ""))
  );
}

const GUIDE_LINKS = {
  "property-registration-checklist-gujarat": [
    ["Agricultural land for sale in Gandhinagar", "/agricultural-land-for-sale/gandhinagar"],
    ["Plots for sale in Ahmedabad", "/plots-for-sale/ahmedabad"],
  ],
  "2-bhk-or-3-bhk-gandhinagar-home-guide": [
    ["2 BHK flats for sale in Gandhinagar", "/2-bhk-flats-for-sale/gandhinagar"],
    ["Properties for sale in Kudasan", "/properties-for-sale/gandhinagar/kudasan"],
  ],
  "selling-property-in-gandhinagar-guide": [
    ["Properties for sale in Gandhinagar", "/properties-for-sale/gandhinagar"],
  ],
  "gift-city-property-investment-buyer-guide": [
    ["Properties for sale in Gandhinagar", "/properties-for-sale/gandhinagar"],
    ["Properties for sale in Kudasan", "/properties-for-sale/gandhinagar/kudasan"],
  ],
  "how-to-buy-plot-in-ahmedabad": [
    ["Plots for sale in Ahmedabad", "/plots-for-sale/ahmedabad"],
    ["Plots for sale in Viramgam", "/plots-for-sale/viramgam"],
  ],
};

export function relevantPropertyLinksForBlog(blog = {}) {
  return GUIDE_LINKS[blog.slug] || [];
}

const ACTIVE_LOCATION_PATHS = {
  gandhinagar: "/properties-for-sale/gandhinagar",
  ahmedabad: "/properties-for-sale/ahmedabad",
  kudasan: "/properties-for-sale/gandhinagar/kudasan",
  palaj: "/properties-for-sale/gandhinagar/palaj",
  dhanap: "/properties-for-sale/gandhinagar/dhanap",
  shela: "/properties-for-sale/ahmedabad/shela",
  memnagar: "/properties-for-sale/ahmedabad/memnagar",
  viramgam: "/properties-for-sale/ahmedabad/viramgam",
};

export function activeBlogLocationLinks(blog = {}) {
  return (blog.relatedLocations || []).flatMap((name) => {
    const key = String(name).toLowerCase().trim();
    const href = ACTIVE_LOCATION_PATHS[key];
    return href ? [[`Properties for sale in ${name}`, href]] : [];
  });
}
