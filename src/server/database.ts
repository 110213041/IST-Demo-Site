import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

type envKey = "DATABASE_HOST" | "DATABASE_DB" | "DATABASE_USERNAME" | "DATABASE_PASSWORD";

const env: Record<envKey, string> = await load();

const dbClient = await new Client().connect(
    {
        hostname: env["DATABASE_HOST"],
        username: env["DATABASE_USERNAME"],
        db: env["DATABASE_DB"],
        password: env["DATABASE_PASSWORD"],
    },
);

export async function resetDatabase(): Promise<boolean> {
    console.log("reset database call.");

    let result: Record<"TABLE_SCHEMA" | "TABLE_NAME", string>[] = await dbClient.query(
        `SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA != "information_schema";`,
    );

    result.forEach(async (v) => {
        try {
            await dbClient.execute(`DROP TABLE IF EXISTS ${v["TABLE_NAME"]};`);
        } catch (e) {
            console.error(e);
            return false;
        }
    });

    result = await dbClient.query(
        `SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.tables WHERE TABLE_SCHEMA != "information_schema";`,
    );

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

export async function getComment() {
    type messageBoardResult = {
        id: number;
        name: string;
        content: string;
    };

    const result: messageBoardResult[] = await dbClient.query("SELECT * FROM message_board;");

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
