import { serveDir, serveFile } from "https://deno.land/std@0.204.0/http/file_server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

import {
    commentType,
    getComment,
    insertComment,
    resetDatabase,
    searchComment,
} from "server/database.ts";
import { requestLog } from "server/util.ts";

export function resetDbHandler(req: Request): Response {
    // const status = await resetDatabase() ? 200 : 500;
    const status = resetDatabase() ? 200 : 500;

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

export async function postCommentHandler(req: Request): Promise<Response> {
    if (req.method != "POST") {
        return new Response("Method Not Allowed", {
            status: 405,
            headers: {
                "content-type": "text/plain",
            },
        });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType || contentType !== "application/json") {
        console.log(`content error: ${contentType}`);
    }

    const decoder = new TextDecoder();
    const reqBody = req.body;

    if (!reqBody) {
        return new Response("400", { status: 400 });
    }

    const reqBodyContent = [];

    for await (const chunk of req.body) {
        reqBodyContent.push(decoder.decode(chunk));
    }

    const receivedForm: commentType = JSON.parse(reqBodyContent.join(""));
    console.log(`server receivedData: ${reqBodyContent.join("")}`);

    const isInsertSuccess = await insertComment(receivedForm);

    const respStatus = isInsertSuccess ? 200 : 500;

    requestLog(req, respStatus);

    return await new Response(`${respStatus}`, {
        status: respStatus,
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

export async function searchPageHandler(req: Request): Promise<Response> {
    const reqUrl = new URL(req.url);
    const queryContent = reqUrl.searchParams.get("q");

    if (queryContent === null) {
        requestLog(req, 200);
        return await responseTemplate(req, "./src/client/search.html");
    }

    const dbResult = searchComment(queryContent);

    const searchPage = await Deno.readFile("./src/client/search.html");
    const pageString = new TextDecoder().decode(searchPage);

    const pageDOM = new DOMParser().parseFromString(pageString, "text/html")!;

    const resultDOM = pageDOM.querySelector(
        `meta[name="search-result"]`,
    )! as unknown as HTMLMetaElement;

    resultDOM.setAttribute("content", JSON.stringify(dbResult));

    // const commentH2 = pageDOM.querySelector(
    //     "#display-comment-section>h2",
    // )! as unknown as HTMLHeadingElement;

    // commentH2.innerHTML = `Result of: "${queryContent}"`;

    requestLog(req, 200);

    return new Response(
        `<!DOCTYPE html>${pageDOM.documentElement!.innerHTML}`,
        {
            status: 200,
            headers: {
                "content-type": "text/html",
            },
        },
    );
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
