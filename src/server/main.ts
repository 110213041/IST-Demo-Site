import {
    aboutPageHandler,
    defaultHandler,
    getCommentHandler,
    indexPageHandler,
    postCommentHandler,
    resetDbHandler,
    searchPageHandler,
    staticPathHandler,
} from "server/handler.ts";

function main(req: Request): Response | Promise<Response> {
    const reqUrl = new URL(req.url);

    if (reqUrl.pathname.includes("/static")) {
        return staticPathHandler(req);
    }

    const pathName = reqUrl.pathname;

    switch (pathName) {
        /** api call */

        case "/reset_db":
            return resetDbHandler(req);

        case "/get_comment":
            return getCommentHandler(req);

        case "/post_comment":
            return postCommentHandler(req);
        /** page route */

        case "/about":
            return aboutPageHandler(req);

        case "/search":
            return searchPageHandler(req);

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
