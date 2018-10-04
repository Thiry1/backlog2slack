import {SlackMessage} from "./type";
import fetch from "node-fetch";

export class SlackNotificator {
    constructor(private webhookUrl: string) {
    }

    /**
     * 通知する.
     */
    notify = async (message: SlackMessage): Promise<boolean> => {
        try {
            await fetch(this.webhookUrl, {
                method: "POST",
                body: JSON.stringify(message),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("post to slack complete");
            return true;
        } catch (error) {
            console.error("failed to post to slack", (error as Error).name, (error as Error).message);
            return false;
        }
    };
}
