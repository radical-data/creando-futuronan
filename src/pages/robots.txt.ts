export const prerender = true;
export function GET({ site }: { site: URL }) {
  const body = `User-agent: *
Allow: /
Sitemap: ${new URL("/sitemap-index.xml", site).toString()}`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
