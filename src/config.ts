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

export const getConfig = (): Config => {
    // require のキャッシュを削除.
    delete require.cache[require.resolve("config")];
    return require("config");
};
