export namespace BackLogWebHookPayload {
    export enum EventType {
        /**
         * 課題の追加
         */
        IssueAdded = 1,
        /**
         * 課題の更新
         */
        IssueUpdated,
        /**
         * コメント
         */
        Comment,
    }
    export interface BasePayload {
        /**
         * 課題などの作成日時.
         * @example 2018-10-03T08:32:36Z
         */
        created: string;
        project: {
            /**
             * アーカイブされているか.
             */
            archived: boolean;
            /**
             * プロジェクトのキー.
             */
            projectKey: string;
            /**
             * プロジェクトの名前.
             */
            name: string;
            /**
             * 謎.
             */
            chartEnabled: boolean;
            /**
             * プロジェクトのユニーク ID.
             */
            id: number;
            /**
             * 謎.
             */
            subtaskingEnabled: boolean;
        };
        /**
         * 謎.
         */
        id: number;
        /**
         * イベントの種類
         */
        type: EventType;
        /**
         * 謎.
         */
        notifications: any[];
        /**
         * 作成者
         */
        createdUser: {
            /**
             * ヌーラボのアカウント情報
             */
            nulabAccount: {
                nulabId: string;
                name: string;
                uniqueId: string;
            };
            /**
             * 名前.
             */
            name: string;
            /**
             * メールアドレス.
             */
            mailAddress: string | null;
            /**
             * ID.
             */
            id: number;
            /**
             * ロールの種類.
             */
            roleType: number;
            /**
             * 言語.
             * @example ja
             */
            lang: string;
            /**
             * ユーザー ID.
             */
            userId: string | null;
        };
        content: BaseContent;
    }
    export interface BaseContent {
        /**
         * サマリー.
         */
        summary: string;
        /**
         * ID.
         */
        key_id: number;
        /**
         * 説明.
         */
        description: string;
        /**
         * コメント.
         */
        comment: Comment;
    }

    export interface Change {
        field: string;
        new_value: string;
        old_value: string;
        type: string;
    }
    export interface Comment {
        id: number;
        content: string;
    }
    /**
     * 課題が追加されたときのペイロード
     */
    export interface IssueAddedPayload extends BasePayload {
        content: BaseContent & {
            /**
             * カスタムフィールド.
             */
            customFields: any[];
            /**
             * 期限日.
             */
            dueDate: string;
            /**
             * 重要度.
             */
            priority: {
                name: string;
                id: string | null;
            };
            /**
             * 謎.
             */
            resolution: {
                name: string;
                id: string | null;
            };
            /**
             * 謎.
             */
            actualHours: string | null;
            /**
             * 課題の種類.
             */
            issueType: {
                color: string;
                name: string;
                displayOrder: null | any;
                id: number;
                projectId: string | null;
            };
            /**
             * マイルストーン
             */
            milestone: any[];
            /**
             * バージョン.
             */
            versions: any[];
            /**
             * 親の課題の ID.
             */
            parentIssueId: string | null;
            /**
             * 見積もり時間.
             */
            estimatedHours: string | null;
            /**
             * 謎の ID.
             */
            id: number;
            /**
             * アサイニー
             */
            assignee: string | null;
            /**
             * カテゴリー.
             */
            category: any[];
            /**
             * 開始日時.
             */
            startDate: string;
            /**
             * 課題のステータス.
             */
            status: {
                /**
                 * @example "In Progress"
                 */
                name: string;
                id: number;
            };
        };
    }
    export interface IssueUpdatedPayload extends BasePayload {
        content: BaseContent & {
            changes: Change[];
        };
        id: number;
    }
    export interface CommentPayload extends BasePayload {
        content: BaseContent;
    }
}

export interface SlackMessage {
    attachments?: {
        /**
         * タイトル
         */
        title: string;
        /**
         * タイトルのリンク.
         */
        title_link?: string;
        /**
         * アタッチメントが表示できない環境(通知など)で表示するテキスト.
         */
        fallback?: string;
        /**
         * アタッチメントを表示する前に表示するテキスト.
         */
        pretext?: string;
        /**
         * アタッチメントのラベルの色.
         * @example #36a64f
         */
        color: string;
        /**
         * アタッチメント.
         */
        fields: {
            title: string;
            value: string;
        }[];
    }[];
}
