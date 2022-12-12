import mongoose from "mongoose";
import ExpressApp from "../ExpressApp";

export default function main() {
    const env = process.env.NODE_ENV;

    if (env != "prod" && env != "dev")
        return;


    const expressApp = new ExpressApp([]);
    expressApp.boot();
}