import { Callout } from "fumadocs-ui/components/callout";
import { Card, Cards } from "fumadocs-ui/components/card";
import { File, Files, Folder } from "fumadocs-ui/components/files";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { Book, Bookshelf } from "@/app/docs/_components/book";
import { DemoBlock } from "@/app/docs/_components/demo-block";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Tab,
    Tabs,
    Step,
    Steps,
    Card,
    Cards,
    File,
    Files,
    Folder,
    DemoBlock,
    Book,
    Bookshelf,
    ...components,
  };
}

export function useMDXComponents(): MDXComponents {
  return getMDXComponents();
}
