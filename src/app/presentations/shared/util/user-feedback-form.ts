export class UserFeedbackForm {
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

    isEmpty(): boolean {
        [this.handle, this.comment_positive, this.comment_negative]
            .forEach(e => {
                if (e !== null) {
                    return false;
                }         
            })
            if (Number(this.grade) !== 0) {
                return false;
            }
        return true;
    }
}