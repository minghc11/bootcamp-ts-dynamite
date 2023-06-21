import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        const moves: BotSelection[] = ['R', 'S', 'P', 'W'];
        const randomNum = this.getRandomNumber(0, 3);
        return moves[randomNum]
    }

    // Generate a random number between min and max (inclusive)
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  
}

export = new Bot();