import { loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";

export const docs = defineDocs({
  dir: "content/docs",
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
