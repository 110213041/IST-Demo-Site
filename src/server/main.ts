import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts";

import { requestLog } from "server/util.ts";
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
        case "/reset_db": {
            requestLog(req, 200);
            return resetDbHandler();
        }

        case "/about": {
            requestLog(req, 200);
            return aboutPageHandler(req);
        }

        case "/": {
            requestLog(req, 200);
            return indexPageHandler(req);
        }

        default: {
            requestLog(req, 404);
            return defaultHandler();
        }
    }
}

if (import.meta.main) {
    // resetDatabasePerFourHour();
    Deno.serve((req) => main(req));
}
