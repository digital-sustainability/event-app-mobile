export interface UserFeedback {
    createdAt?: string | Date,
    updatedAt?: string | Date,
    id?: number,
    grade: number,
    handle: string,
    comment_positive: string,
    comment_negative: string,
    presentation_id: number,
    uuid: string
}
