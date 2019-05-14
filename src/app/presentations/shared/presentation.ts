import { Speaker } from './speaker';
import { Session } from '../../sessions/shared/session';

export interface Presentation {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    slides: string,
    event_id: number,
    start: string | Date,
    end: string | Date,
    access_token: string,
    room: string,
    speakers: Speaker[],
    feedbacks: any[],
    // TODO: @oscar: je nach abgrage von sails ist die session_id number oder object
    session_id: Session | number
}
