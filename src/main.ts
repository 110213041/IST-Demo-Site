import { serveDir } from "https://deno.land/std@0.204.0/http/file_server.ts";

import { resetDatabase } from "server/database.ts";
import { handleSuccessLog } from "server/util.ts";
import { aboutPageHandler, indexPageHandler } from "server/website.ts";

async function resetDbHandler(): Promise<Response> {
    const status = await resetDatabase() ? 200 : 500;

    return new Response(JSON.stringify({ status: status }), {
        status: status,
        headers: {
            "content-type": "application/json",
        },
    });
}

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
            handleSuccessLog(pathName);
            return resetDbHandler();
        }

        case "/about": {
            handleSuccessLog(pathName);
            return aboutPageHandler();
        }

        case "/": {
            handleSuccessLog(pathName);
            return indexPageHandler();
        }

        default: {
            console.log(`handle unknown path: "${pathName}", return 404.`);

            return new Response("Not Found", {
                status: 404,
                headers: {
                    "content-type": "text/plain",
                },
            });
        }
    }
}

if (import.meta.main) {
    // resetDatabasePerFourHour();
    Deno.serve((req) => main(req));
}
