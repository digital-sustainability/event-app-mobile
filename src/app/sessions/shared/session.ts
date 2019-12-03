import { Presentation } from '../../presentations/shared/presentation';
import { Event } from '../../events/shared/event';

export interface Session {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    formatted_abstract: string,
    room: string,
    label_presentations: string,
    event_id: Event,
    presentations: Presentation[]
}
