export interface Config {
    /**
     * backlog のプロジェクトの key.
     * @example TEST
     */
    [projectKey: string]: {
        /**
         * backlog のルート URL.
         * @example https://hoge.backlog.com
         */
        backlogRootUrl: string;
        /**
         * slack の webhook url.
         */
        slackWebhookUrl: string;
    };
}

export const config: Config = {
    TEST: {
        backlogRootUrl: "",
        slackWebhookUrl: "",
    },
};
