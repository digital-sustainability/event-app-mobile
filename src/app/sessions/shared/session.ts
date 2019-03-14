import { Presentation } from '../../presentations/shared/presentation';
import { Event } from '../../events/shared/event';

export interface Session {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    room: string,
    event_id: Event,
    presentations: Presentation[]
}
