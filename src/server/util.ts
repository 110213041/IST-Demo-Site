import { Status } from "https://deno.land/std@0.204.0/http/http_status.ts";

export function handleSuccessLog(path: string) {
    console.log(`handle success, path: "${path}".`);
}

export function handleFailLog(path: string) {
    console.log(`handle fail, path: "${path}".`);
}

export function requestLog(req: Request, status: Status) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = `${now.getUTCMonth() + 1}`.padStart(2, "0");
    const date = now.getUTCDate().toString().padStart(2, "0");

    const hour = now.getUTCHours().toString().padStart(2, "0");
    const minute = now.getUTCMinutes().toString().padStart(2, "0");
    const second = now.getUTCSeconds().toString().padStart(2, "0");

    const url = new URL(req.url);
    const fmt =
        `[${year}-${month}-${date} ${hour}:${minute}:${second}] [${req.method}] ${url.pathname} ${status}`;
    console.log(fmt);
}
