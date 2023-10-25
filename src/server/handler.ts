import { serveFile } from "https://deno.land/std@0.204.0/http/file_server.ts";

import { resetDatabase } from "server/database.ts";

export async function resetDbHandler(): Promise<Response> {
    const status = await resetDatabase() ? 200 : 500;

    return new Response(JSON.stringify({ status: status }), {
        status: status,
        headers: {
            "content-type": "application/json",
        },
    });
}

async function responseTemplate(req: Request, path: string): Promise<Response> {
    return await serveFile(req, path);
}

export async function indexPageHandler(req: Request): Promise<Response> {
    return await responseTemplate(req, "./src/client/index.html");
}

export async function aboutPageHandler(req: Request): Promise<Response> {
    return await responseTemplate(req, "./src/client/about.html");
}

export function defaultHandler() {
    return new Response("Not Found", {
        status: 404,
        headers: {
            "content-type": "text/plain",
        },
    });
}
