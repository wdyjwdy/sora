import { log, buildContentFile } from "./build.ts";
import { join } from "node:path";
import { watch } from "fs";
import type { ServerWebSocket } from "bun";
import config from "./config";

type Socket = ServerWebSocket<{ pathname: string }>;

const clients = new Map<string, Socket>();

function serve(port = 3333) {
  Bun.serve({
    port,
    websocket: {
      // when open or refresh a page
      open(ws: Socket) {
        clients.set(ws.data.pathname, ws);
      },
      message() {},
    },
    async fetch(req, server) {
      // get pathname
      const pathname = new URL(req.url).pathname;
      let filepath;
      if (pathname === "/") {
        filepath = join(config.outputPath, "index.html");
      } else if (pathname.startsWith("/sora/")) {
        filepath = join(config.outputPath, pathname.slice(5));
      } else {
        filepath = join(config.outputPath, pathname + ".html");
      }
      console.log(filepath);

      // update socket
      const success = server.upgrade(req, {
        data: {
          pathname,
        },
      });
      if (success) return;

      // response page
      const file = Bun.file(filepath, { type: "text/html" });
      if (!(await file.exists())) {
        return new Response("Not Found", { status: 404 });
      }
      return new Response(file);
    },
  });

  // watch(config.contentPath, { recursive: true }, async (_, filename) => {
  //   await buildContentFile(join(config.contentPath, filename!), true);
  //   const pathname = "/" + filename?.replace("md", "html");
  //   const ws = clients.get(pathname);
  //   if (ws?.readyState === 1) {
  //     ws.send("reload");
  //   }
  //   console.log(`\x1b[34m[sora]\x1b[0m rebuild \x1b[37m${filename}\x1b[0m`);
  // });

  console.log(`\x1b[34m[sora]\x1b[0m listen \x1b[37mlocalhost:${port}\x1b[0m`);
}

// await log({ liveReload: true });
serve();
