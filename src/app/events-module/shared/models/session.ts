import { Presentation } from './presentation';
import { Event } from './event';

export interface Session {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    room: string,
    label_presentations: string,
    event_id: Event,
    presentations: Presentation[]
}
