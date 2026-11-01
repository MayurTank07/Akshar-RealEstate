import assert from "node:assert/strict";
import test from "node:test";
import { optimizedImageUrl, responsiveImageProps } from "../src/utils/imageSeo.js";

test("Cloudinary thumbnails replace stored transformations with one responsive crop", () => {
  const stored = "https://res.cloudinary.com/djld7zzuo/image/upload/f_auto,q_auto/c_limit,w_1600/v1/akshar-realestate/properties/plot.jpg?_a=sample";
  const optimized = optimizedImageUrl(stored, { width: 360, height: 240 });
  assert.equal(optimized, "https://res.cloudinary.com/djld7zzuo/image/upload/f_auto,q_auto,w_360,h_240,c_fill,g_auto/v1/akshar-realestate/properties/plot.jpg?_a=sample");
  const props = responsiveImageProps(stored, { width: 720, height: 480, widths: [360, 720] });
  assert.match(props.srcSet, /w_360,h_240,c_fill,g_auto\/v1/);
  assert.match(props.srcSet, /w_720,h_480,c_fill,g_auto\/v1/);
  assert.doesNotMatch(props.srcSet, /c_limit,w_1600/);
});
