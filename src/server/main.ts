import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts";

import {
    aboutPageHandler,
    defaultHandler,
    indexPageHandler,
    resetDbHandler,
} from "server/handler.ts";

function main(req: Request): Response | Promise<Response> {
    const reqUrl = new URL(req.url);

    if (reqUrl.pathname.includes("/static")) {
        return serveDir(
            req,
            {
                fsRoot: "src/client/static",
                urlRoot: "static",
            },
        );
    }

    const pathName = reqUrl.pathname;

    switch (pathName) {
        case "/reset_db":
            return resetDbHandler(req);

        case "/about":
            return aboutPageHandler(req);

        case "/":
            return indexPageHandler(req);

        default:
            return defaultHandler(req);
    }
}

if (import.meta.main) {
    // resetDatabasePerFourHour();
    Deno.serve((req) => main(req));
}
