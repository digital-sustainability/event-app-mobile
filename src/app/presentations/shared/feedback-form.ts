export class FeedbackForm {
    public handle: string;
    public grade: number;
    public comment_positive: string;
    public comment_negative: string;

    constructor(
        handle: string, 
        grade: number,
        comment_positive: string,
        comment_negative: string
    ) {
        this.handle = handle;
        this.grade = grade;
        this.comment_positive = comment_positive;
        this.comment_negative = comment_negative;
    }

    
    // TODO: Move check-null method here
}