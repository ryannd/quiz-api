export default class Player {
    id: string;
    name: string;
    score: number = 0;
    answer: string = "";
    room: string = "";

    constructor(id: string, name: string, room: string) {
        this.id = id;
        this.name = name;
        this.room = room;
    }

    updateScore(wasAnswerCorrect: boolean) {
        this.score += wasAnswerCorrect ? 10 : 0;
        return this.score;
    }

    updateAnswer(answer: string) {
        this.answer = answer;
        return this.answer;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getAnswer() {
        return this.answer;
    }

    getScore() {
        return this.score;
    }
}
