import { type } from 'os';
import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    dynamite_counter: number;

    constructor() {
        this.dynamite_counter = 0;
    }

    makeMove(gamestate: Gamestate): BotSelection {

        // this.getOpponentProbability(gamestate);

        let move = this.getRandomMove();
        // console.log('my move:', move);
        // console.log('previous move:', gamestate.rounds[gamestate.rounds.length - 1]);

        if (gamestate.rounds.length == 0)
        {
            return 'D';
        }

        const isWon = this.getLastResult(gamestate);
        if (isWon)
        {
            const lastRound = gamestate.rounds[gamestate.rounds.length - 1];
            if (lastRound.p1 == 'D')
            {
                if (this.dynamite_counter > 100)
                {
                    return move;
                }
                this.dynamite_counter ++;  
            }
            return lastRound.p1;
        }

        const opponentMove = this.getOpponentHighestProbability(gamestate);
        const counterMoveMap = new Map<BotSelection, BotSelection>([
            ['D', 'W'],
            ['P', 'S'],
            ['R', 'P'],
            ['S', 'R'],
            ['W', 'R'],
        ])

        move = counterMoveMap.get(opponentMove);
        const dRate = this.getRandomNumber(0, 5);
        // console.log('opponent', opponentMove);
        // console.log('rate', dRate);
        if (opponentMove != 'W' && dRate != 0 && this.dynamite_counter < 100)
        {
            move = 'D';
            this.dynamite_counter ++;
        }
        return move;
        
    }

    // Generate a random number between min and max (inclusive)
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandomMove(): BotSelection{
        const moves: BotSelection[] = ['R', 'S', 'P', 'W', 'D', 'D', 'D'];
        let randomNum = this.getRandomNumber(0, 6);
        if (randomNum >= 4)
        {
            this.dynamite_counter ++;
        }

        if (this.dynamite_counter > 100)
        {
            randomNum = this.getRandomNumber(0, 3);
        }

        return moves[randomNum];
    }

    getLastResult(gamestate: Gamestate):boolean{ // return true if the most recent round is won, otherwise false
        const lastRound = gamestate.rounds[gamestate.rounds.length - 1];
        const moveMap = new Map<BotSelection, BotSelection[]>([
            ['D', ['R', 'P', 'S']],
            ['P', ['R']],
            ['R', ['S']],
            ['S', ['P']],
            ['W', ['D']],
        ])

        for (let [winningMove, losingMoves] of moveMap)
        {
            if (lastRound.p1 == winningMove && losingMoves.includes(lastRound.p2))
            {
                return true;
            }
        }


        return false;
    }

    getOpponentHighestProbability(gamestate: Gamestate): BotSelection{ // for the last 10 rounds

        let probDict = new Map<BotSelection, number>([
            ['R', 0],
            ['D', 0],
            ['P', 0],
            ['S', 0],
            ['W', 0],
        ])
        
        let countDict = new Map<BotSelection, number>([
            ['R', 0],
            ['D', 0],
            ['P', 0],
            ['S', 0],
            ['W', 0],
        ])

        
        let n = 0;
        for (const round of gamestate.rounds)
        {
            n++;
            if (n > gamestate.rounds.length - 5)
            {
                countDict.set(round.p2, countDict.get(round.p2) + 1);
            }
        }
        
        let highestProb = 0;
        let selectedMove: BotSelection;

        for (let [move, count] of countDict)
        {
            if (count > highestProb)
            {
                selectedMove = move;
                highestProb = count;
            }
        }


        return selectedMove;
        
    }
  
}

export = new Bot();