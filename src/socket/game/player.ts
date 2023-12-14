export default class Player {
    id: string;
    name: string;
    score: number = 0;
    answer: string = "";

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }

    updateScore(wasAnswerCorrect: boolean) {
        this.score += wasAnswerCorrect ? 10 : 0;
        return this.score;
    }

    updateAnswer(answer: string) {
        this.answer = answer;
    }
}
