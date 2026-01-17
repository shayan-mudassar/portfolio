import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const owner = process.env.GITHUB_REPOSITORY?.split("/")[0];
const isUserSite =
  repo && owner && repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;

const base = process.env.ASTRO_BASE || (repo ? (isUserSite ? "/" : `/${repo}/`) : "/");
const site =
  process.env.SITE_URL ||
  (repo && owner
    ? isUserSite
      ? `https://${owner}.github.io/`
      : `https://${owner}.github.io/${repo}/`
    : "http://localhost:4321/");

export default defineConfig({
  site,
  base,
  output: "static",
  integrations: [react(), sitemap()],
});
