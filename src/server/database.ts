import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
// import { prepareVirtualFile } from "https://deno.land/x/mock_file@v1.1.2/mod.ts";

// import { decodeBase64 } from "https://deno.land/std@0.205.0/encoding/base64.ts";

type envKey =
    | "DATABASE_HOST"
    | "DATABASE_DB"
    | "DATABASE_PORT"
    | "DATABASE_USERNAME"
    | "DATABASE_PASSWORD"
    // Deploy relate
    | "DATABASE_DEPLOY_STATE";
// | "DATABASE_CA";

let env: Record<envKey, string | undefined>;

if (Deno.env.get("DATABASE_DEPLOY_STATE") === "DEPLOY") {
    env = {
        "DATABASE_HOST": Deno.env.get("DATABASE_HOST"),
        "DATABASE_DB": Deno.env.get("DATABASE_DB"),
        "DATABASE_PORT": Deno.env.get("DATABASE_PORT"),
        "DATABASE_USERNAME": Deno.env.get("DATABASE_USERNAME"),
        "DATABASE_PASSWORD": Deno.env.get("DATABASE_PASSWORD"),
        // Deploy relate
        "DATABASE_DEPLOY_STATE": Deno.env.get("DATABASE_DEPLOY_STATE"),
    };
} else {
    env = await load();
}

const caFilePath = (() => {
    const filePath = "./ca.pem";
    // prepareVirtualFile(filePath);

    // const encodeCaByte = env["DATABASE_CA"];
    // if (encodeCaByte === undefined) {
    //     console.error("DATABASE_CA env not found");
    // } else {
    //     const caContentByte = new TextEncoder().encode(
    //         new TextDecoder().decode(decodeBase64(encodeCaByte)),
    //     );
    //     Deno.writeFileSync(filePath, caContentByte);
    // }
    return filePath;
})();

const dbClient = await new Client().connect(
    env["DATABASE_DEPLOY_STATE"] !== "DEPLOY"
        ? {
            hostname: env["DATABASE_HOST"],
            username: env["DATABASE_USERNAME"],
            db: env["DATABASE_DB"],
            password: env["DATABASE_PASSWORD"],
        }
        : {
            hostname: env["DATABASE_HOST"],
            port: parseInt(env["DATABASE_PORT"] !== undefined ? env["DATABASE_PORT"] : "3306"),
            username: env["DATABASE_USERNAME"],
            db: env["DATABASE_DB"],
            password: env["DATABASE_PASSWORD"],
            tls: {
                caCerts: [caFilePath],
            },
        },
);

export async function resetDatabase(): Promise<boolean> {
    console.log("reset database call.");

    const checkTableQuery =
        `SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA = '${
            env["DATABASE_DB"]
        }'`;

    let result: Record<"TABLE_SCHEMA" | "TABLE_NAME", string>[] = await dbClient.query(
        checkTableQuery,
    );

    result.forEach(async (v) => {
        try {
            await dbClient.execute(`DROP TABLE IF EXISTS ${v["TABLE_NAME"]};`);
        } catch (e) {
            console.error(e);
            return false;
        }
    });

    result = await dbClient.query(checkTableQuery);

    if (result.length != 0) {
        console.error("fail to drop all table!");
        return false;
    }

    const resetScriptUint8Array = await Deno.readFile("./src/server/schema.sql");
    const resetScript = new TextDecoder().decode(resetScriptUint8Array).split(";");

    resetScript.forEach(async (v) => {
        if (v == "") return;
        try {
            await dbClient.execute(v.trim());
        } catch (e) {
            console.error(`schema.sql query fail! v= ${v}`);
            console.error(e);
            return false;
        }
    });

    console.log("reset database success");
    return true;
}

export async function resetDatabasePerFourHour(): Promise<void> {
    console.log("resetDatabasePerFourHour call!");
    await resetDatabase();

    const currentTime = new Date();
    console.log(`current time: ${currentTime}`);

    const seconds = currentTime.getUTCSeconds();
    const milliSeconds = currentTime.getUTCMilliseconds();

    setTimeout(resetDatabasePerFourHour, (60 * 3 * 1000) - (seconds * 10000) - milliSeconds);
}
type messageBoardResult = {
    id: number;
    name: string;
    content: string;
};

export async function getComment() {
    const result: messageBoardResult[] = await dbClient.query(
        "SELECT `id`, `name`, `content` FROM message_board;",
    );

    return result;
}

export async function searchComment(target: string) {
    const result: messageBoardResult[] = await dbClient.query(
        "SELECT `id`, `name`, `content` FROM message_board WHERE `name` LIKE ? OR `content` LIKE ?",
        [
            `%${target}%`,
            `%${target}%`,
        ],
    );

    return result;
}

export type commentType = {
    name: string;
    content: string;
};

export async function insertComment(comment: commentType): Promise<boolean> {
    try {
        await dbClient.execute(
            "INSERT INTO message_board (`name`, `content`) VALUES (?, ?)",
            [
                comment.name,
                comment.content,
            ],
        );
    } catch (e) {
        console.error(e);
        return false;
    }

    return true;
}
