import { Hono } from "hono";

const app = new Hono();

function View(props: { svg: string; url: string }) {
  const { svg, url } = props;
  const title = url.split("/").pop()!;
  return (
    <html>
      <title>{title}</title>
      <body>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        <a href={`/download/${url}`} download={title}>
          ダウンロード
        </a>
      </body>
    </html>
  );
}

app.get("/preview/:url", async (c) => {
  const url = c.req.param("url");
  if (!url) return c.text("You have to inclued `url` as a query parameter");
  const res = await fetch(url);
  if (res.status !== 200) return c.text("Failed to fetch the image");
  const svg = await res.text();
  return c.html(<View svg={svg} url={url} />);
});

app.get("/download/:url", async (c) => {
  const url = c.req.param("url");
  const res = await fetch(url);
  if (res.status !== 200) return c.text("Failed to fetch the image");
  const svg = await res.text();
  const title = url.split("/").pop()!;
  c.header("Content-Disposition", `attachment; filename=${title}`);
  return c.text(svg);
});

export default app;
