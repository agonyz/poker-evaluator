import {winningOddsForPlayer} from "./poker-evaluator";

const DEFAULT_CYCLES = 1000;
const DEFAULT_PLAYER_COUNT = 5;

const TEST_TOLERANCE = 1;

/*
This models a parabola, the shape that emerged after charting variances for different probabilities.
The variances that this produces may be overly wide, but it should ensure that this never fails even across countless tests,
unless the code is actually broken.
 */
function expectedVariance(expectedProbability:number): number {
    const centerProbability = 0.5;
    const realPeak = 2.2 + TEST_TOLERANCE;
    const direction = -4.8;

    return direction * Math.pow(expectedProbability - centerProbability, 2) + realPeak;
}

function findVariance(expectedProbability:number, cycles: number):number {
    return expectedVariance(expectedProbability) / Math.sqrt(cycles);
}

function withinRange(expected: number, actual: number, cycles: number): boolean {
    const variance = findVariance(expected, cycles);
    const diff = Math.abs(expected - actual);
    const threshold = diff / (variance / 2);
    return threshold < 1;
}

/**
 * Based on probabilities taken from https://homes.luddy.indiana.edu/kapadia/nofoldem/
 */
describe('PokerEvaluator', () => {
    describe('calculates hole card odds', () => {
        it('pocket aces', () => {
            testHoleCards(['as','ac'], 0.5578);
        });
        it('seven deuce', () => {
            testHoleCards(['2s','7c'], 0.0972);
        });
        it('23 suited', () => {
            testHoleCards(['2c','3c'],0.143)
        });
        it('ak suited', () => {
            testHoleCards(['ac','kc'], 0.3408)
        });
        it('pocket jacks', () => {
            testHoleCards(['js','jc'], 0.3994);
        });
    });
    describe('calculates community and hole card odds', () => {
        it('low trips high card', () => {
            testCommunityCards(['2d','ah'],['2h','2c','7c'], 0.7545);
        });
        it('low set', () => {
            testCommunityCards(['2d','2c'],['2h','jd','7c'], 0.846);
        });
        it('high set', () => {
            testCommunityCards(['jh','jc'],['jd','2h','7c'],0.8991);
        });
        it('junk', () => {
            testCommunityCards(['5s','3d'],['2h','tc','7c'], 0.0455);
        });
        it('low pair high card', () => {
            testCommunityCards(['2d','ah'],['2h','tc','7c'], 0.1795);
        });
        it('high pair high card', () => {
            testCommunityCards(['ks','ah'],['ad','tc','7c'],0.5187);
        });
        it('open ended straight', () => {
            testCommunityCards(['9d','8c'],['3h','tc','jd'], 0.2596);
        });
        it('gutshot', () => {
            testCommunityCards(['9d','7c'],['3h','tc','jd'],0.1549);
        });
        it('straight', () => {
            testCommunityCards(['9d','7c'],['8d','tc','jd'],0.5978);
        });
        it('low flush', () => {
            testCommunityCards(['3c','2c'],['jc','tc','qc'],0.6253);
        });
        it('nuts flush', () => {
            testCommunityCards(['ac','2c'],['jc','tc','qc'],0.9136);
        });
        it('flush draw', () => {
            testCommunityCards(['ac','2c'],['9h','tc','qc'],0.3804);
        });
        it('straight flush', () => {
            testCommunityCards(['6c','2c'],['3c','4c','5c'], 1.0);
        });
    });
    describe('turn works', () => {
        it('gutshot', () => {
            testCommunityCards(['6d','2c'],['th','qs','5c','3h'],0.0846);
        });
    });
    describe('river works', () => {
        it('hit low straight', () => {
            testCommunityCards(['6d','2c'],['th','qs','5c','3h','4d'],0.9173);
        });
    });
})


function testHoleCards (cards:string[], expected: number) {
    expect(withinRange(expected, winningOddsForPlayer(cards,[], DEFAULT_PLAYER_COUNT, DEFAULT_CYCLES)['winRate'], DEFAULT_CYCLES)).toBeTruthy();
}

function testCommunityCards(hand: string[], community: string[], expected:number) {
    expect(withinRange(expected, winningOddsForPlayer(hand, community, DEFAULT_PLAYER_COUNT, DEFAULT_CYCLES)['winRate'], DEFAULT_CYCLES));
}
