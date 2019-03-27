import { Session } from '../../sessions/shared/session';

export interface Event {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    description: string,
    start: string | Date,
    end: string | Date,
    location: string,
    url: string,
    url_label: string,
    image_path: string,
    sessions: Session[]
}
