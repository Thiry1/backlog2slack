export interface Config {
    /**
     * backlogのルート URL.
     * @example https://hoge.backlog.com
     */
    backlogRootUrl: string;
    /**
     * slack の webhook url.
     */
    slackWebhookUrl: string;
}

export const config: Config = {
    backlogRootUrl: "",
    slackWebhookUrl: "",
};
