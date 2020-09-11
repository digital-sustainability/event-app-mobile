import { Session } from './session';
import { Category } from './category';
import { Speaker } from './speaker';
import { Presentation } from './presentation';

export interface Event {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    title: string,
    description: string,
    formatted_description: string,
    start: string | Date,
    end: string | Date,
    location: string,
    location_details: string,
    url: string,
    url_label: string,
    published: boolean,
    image_path: string,
    sessions: Session[],
    categories: Category[],
    speakers?: Speaker[],
    presentations?: Presentation[];
}
