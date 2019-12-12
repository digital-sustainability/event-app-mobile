import { Presentation } from './presentation';

export interface Speaker {
    createdAt: string | Date,
    updatedAt: string | Date,
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    position: string,
    organization: string,
    short_bio: string
    photo_url: string,
    presentations: Presentation[]
}
