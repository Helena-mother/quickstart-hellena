import { HellenaClient } from "@hellena-sdk/hellena";

if(!process.env.HELLENA_API_KEY) {
    throw new Error("HELLENA_API_KEY is not defined in environment variables");
}

export const hellena = new HellenaClient(
    process.env.HELLENA_API_KEY
);