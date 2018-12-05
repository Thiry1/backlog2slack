import {BackLogWebHookPayload, SlackMessage, SlackNotification} from "./type";
import {getConfig} from "./config";

const UNDEFINED_MESSAGE = "未設定";

export namespace BackLogPayloadParser {
    export const parse = (payload: BackLogWebHookPayload.BasePayload): SlackNotification | null => {
        if (!payload || !payload.type) {
            console.error(`invalid payload. payload: ${JSON.stringify(payload)}`);
            return null;
        }
        const webHookUrl = getWebHookUrl(getProjectKey(payload));
        return {
            webHookUrl,
            message: parsePayload(payload),
        };
    };
    const parsePayload = (payload: BackLogWebHookPayload.BasePayload): SlackMessage => {
        const eventType: BackLogWebHookPayload.EventType = payload.type;
        switch (eventType) {
            case BackLogWebHookPayload.EventType.IssueAdded:
                return parseIssueAddedPayload(payload as BackLogWebHookPayload.IssueAddedPayload);
            case BackLogWebHookPayload.EventType.IssueUpdated:
                return parseIssueUpdatedPayload(payload as BackLogWebHookPayload.IssueUpdatedPayload);
            case BackLogWebHookPayload.EventType.Comment:
                return parseCommentPayload(payload as BackLogWebHookPayload.CommentPayload);
            default:
                console.error(`unsupported payload. payload: ${JSON.stringify(payload)}`);
                return null;
        }
    };
    /**
     * プロジェクトの key を取得する
     * @param payload
     */
    const getProjectKey = (payload: BackLogWebHookPayload.BasePayload): string => payload.project.projectKey;
    /**
     * プロジェクト名に対応する WebHook の URL を取得する.
     */
    const getWebHookUrl = (projectKey: string): string | null => getConfig()[projectKey].backlogRootUrl || null;
    /**
     * 課題のリンクを作成する.
     * @param payload
     */
    const createIssueLink = (payload: BackLogWebHookPayload.BasePayload) =>
        `${getConfig()[getProjectKey(payload)].backlogRootUrl}/view/${payload.project.projectKey}-${payload.content.key_id}`;
    /**
     * コメントのリンクを作成する.
     * @param payload
     */
    const createCommentLink = (payload: BackLogWebHookPayload.BasePayload) =>
        `${createIssueLink(payload)}#comment-${payload.content.comment.id}`;
    /**
     * 変更をパースする.
     * @param changes
     */
    const parseChanges = (changes: BackLogWebHookPayload.Change[]): { title: string, value: string }[] => {
        return changes.map(change => ({
            title: `変更されたフィールド: ${change.field}`,
            value: `${change.old_value || UNDEFINED_MESSAGE} => ${change.new_value || UNDEFINED_MESSAGE}`,
        }));
    };
    /**
     * 課題が作成された場合のペイロードをパースして slack メッセージ形式にする.
     * @param payload
     */
    const parseIssueAddedPayload = (payload: BackLogWebHookPayload.IssueAddedPayload): SlackMessage => {
        const projectKey = getProjectKey(payload);
        return {
            attachments: [
                {
                    title: `${payload.content.summary}`,
                    title_link: `${getConfig()[projectKey].backlogRootUrl}/view/${projectKey}-${payload.content.key_id}`,
                    pretext: "課題が追加されました",
                    color: "#36a64f",
                    fields: [
                        {
                            title: "期限日",
                            value: payload.content.dueDate || UNDEFINED_MESSAGE,
                        },
                        {
                            title: "説明",
                            value: payload.content.description.substr(0, 100) || UNDEFINED_MESSAGE,
                        },
                        {
                            title: "作成者",
                            value: payload.createdUser.name,
                        },
                    ],
                },
            ],
        };
    };
    /**
     * 課題が更新された場合のペイロードをパースして slack メッセージ形式にする.
     * @param payload
     */
    const parseIssueUpdatedPayload = (payload: BackLogWebHookPayload.IssueUpdatedPayload): SlackMessage => {
        return {
            attachments: [
                {
                    title: `${payload.content.summary}`,
                    title_link: createIssueLink(payload),
                    pretext: "課題が更新されました",
                    color: "#36a64f",
                    fields: [
                        ...parseChanges(payload.content.changes),
                        {
                            title: "更新者",
                            value: payload.createdUser.name,
                        },
                    ],
                },
            ],
        };
    };
    /**
     * コメントが投稿された場合のペイロードをパースして slack メッセージ形式にする.
     * @param payload
     */
    const parseCommentPayload = (payload: BackLogWebHookPayload.CommentPayload): SlackMessage => {
        return {
            attachments: [
                {
                    title: `${payload.content.summary}`,
                    title_link: createCommentLink(payload),
                    pretext: "コメントが投稿されました",
                    color: "#36a64f",
                    fields: [
                        {
                            title: "コメント",
                            value: payload.content.comment.content.substr(0, 100),
                        },
                        {
                            title: "投稿者",
                            value: payload.createdUser.name,
                        },
                    ],
                },
            ],
        };
    };
}
