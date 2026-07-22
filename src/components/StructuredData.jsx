import { useEffect } from "react";
import { schemaScriptContent } from "../utils/structuredData";

export default function StructuredData({ id, schema }) {
  useEffect(() => {
    if (!id || !schema) return undefined;
    const scriptId = `akshar-schema-${id}`;
    const script = document.getElementById(scriptId) || document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.dataset.aksharStructuredData = "true";
    script.textContent = schemaScriptContent(schema);
    if (!script.isConnected) document.head.appendChild(script);

    return () => {
      const current = document.getElementById(scriptId);
      if (current) current.remove();
    };
  }, [id, schema]);

  return null;
}
