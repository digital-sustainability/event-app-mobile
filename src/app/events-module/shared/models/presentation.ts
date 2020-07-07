import { Speaker } from './speaker';
import { Session } from './session';

export interface Presentation {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    abstract: string,
    formatted_abstract: string,
    slides: string,
    event_id: number,
    start: string | Date,
    end: string | Date,
    access_token: string,
    position: number,
    room: string,
    speakers: Speaker[],
    feedbacks: any[],
    // TODO: @oscar: je nach abgrage von sails ist die session_id number oder object
    session_id: Session | number
}
