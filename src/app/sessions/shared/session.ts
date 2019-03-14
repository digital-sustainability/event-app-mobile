export interface Session {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    room: string,
    event_id: number,
    presentations: any[]
}
