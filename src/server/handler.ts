import { serveDir, serveFile } from "https://deno.land/std@0.204.0/http/file_server.ts";

import { getComment, resetDatabase } from "server/database.ts";
import { requestLog } from "server/util.ts";

export async function resetDbHandler(req: Request): Promise<Response> {
    const status = await resetDatabase() ? 200 : 500;

    requestLog(req, status);

    return new Response(JSON.stringify({ status: status }), {
        status: status,
        headers: {
            "content-type": "application/json",
        },
    });
}

export async function getCommentHandler(req: Request): Promise<Response> {
    const comments = await getComment();

    requestLog(req, 200);

    return new Response(JSON.stringify(comments), {
        status: 200,
        headers: {
            "content-type": "application/json",
        },
    });
}

export async function staticPathHandler(req: Request): Promise<Response> {
    return await serveDir(
        req,
        {
            fsRoot: "src/client/static",
            urlRoot: "static",
        },
    );
}

async function responseTemplate(req: Request, path: string): Promise<Response> {
    requestLog(req, 200);
    return await serveFile(req, path);
}

export async function indexPageHandler(req: Request): Promise<Response> {
    return await responseTemplate(req, "./src/client/index.html");
}

export async function aboutPageHandler(req: Request): Promise<Response> {
    return await responseTemplate(req, "./src/client/about.html");
}

export function defaultHandler(req: Request) {
    requestLog(req, 404);

    return new Response("Not Found", {
        status: 404,
        headers: {
            "content-type": "text/plain",
        },
    });
}
