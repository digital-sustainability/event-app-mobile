import { Presentation } from './presentation';
import { Event } from './event';

export interface Session {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    formatted_abstract: string,
    room?: string,
    label_presentations?: string,
    position: number,
    event_id: Event,
    presentations: Presentation[]
}
