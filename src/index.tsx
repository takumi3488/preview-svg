import { Hono } from "hono";

const app = new Hono();

function View(props: { svg: string; title: string }) {
  const { svg, title } = props;
  console.log(svg);
  return (
    <html>
      <title>{title}</title>
      <body dangerouslySetInnerHTML={{ __html: svg }} />
    </html>
  );
}

app.get("/", async (c) => {
  const url = c.req.query("url");
  if (!url) return c.text("You have to inclued `url` as a query parameter");
  const res = await fetch(url);
  if (res.status !== 200) return c.text("Failed to fetch the image");
  const svg = await res.text();
  const title = url.split("/").pop()!;
  return c.html(<View svg={svg} title={title} />);
});

export default app;
