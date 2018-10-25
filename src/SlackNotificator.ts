import {SlackMessage, SlackNotification} from "./type";
import fetch from "node-fetch";

export class SlackNotificator {
    /**
     * 通知する.
     */
    notify = async (notification: SlackNotification): Promise<boolean> => {
        try {
            await fetch(notification.webHookUrl, {
                method: "POST",
                body: JSON.stringify(notification.message),
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
