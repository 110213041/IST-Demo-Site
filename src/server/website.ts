// "./src/client/index.html"

async function loadHtml(path: string): Promise<string> {
    const htmlByte = await Deno.readFile(path);
    return new TextDecoder().decode(htmlByte);
}

async function responseTemplate(path: string): Promise<Response> {
    const body = await loadHtml(path);

    return new Response(body, {
        headers: {
            "content-type": "text/html",
        },
    });
}

export async function indexPageHandler(): Promise<Response> {
    return await responseTemplate("./src/client/index.html");
}

export async function aboutPageHandler(): Promise<Response> {
    return await responseTemplate("./src/client/about.html");
}
