import * as express from "express";
import * as bodyParser from "body-parser";
import {BackLogPayloadParser} from "./BackLogPayloadParser";
import {SlackNotificator} from "./SlackNotificator";
import {config} from "./config";

if (!config) {
    throw new Error("No config provided");
}

const slackNotificator = new SlackNotificator();

const app = express();

app.use(bodyParser.json());

app.post("/backlog2slack", async (req: express.Request, res: express.Response) => {
    try {
        console.log("body", JSON.stringify(req.body));
        const message = BackLogPayloadParser.parse(req.body);
        console.log("message", JSON.stringify(message));
        if (message) {
            await slackNotificator.notify(message);
        }
    } catch (error) {
        console.error(`unexpected error. name: ${error.name}, message: ${error.message}`);
    } finally {
        res.end("ok");
    }
});


app.listen(3000, () => console.log("backlog2slack listening on port 3000!"));
