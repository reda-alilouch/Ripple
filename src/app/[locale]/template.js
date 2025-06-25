// src/app/[locale]/template.js
import TemplateClient from "./TemplateClient";

export default function Template({ children }) {
  return <TemplateClient>{children}</TemplateClient>;
}
