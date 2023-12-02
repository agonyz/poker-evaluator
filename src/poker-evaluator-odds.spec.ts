import {winningOdds} from "./poker-evaluator";

const BOUND = 4;
const DEFAULT_CYCLES = 1000;
const DEFAULT_PLAYER_COUNT = 5;

/**
 * After extensive testing this function seems to serve as an appropriate upper bound.
 * Math.E seems a better fit than Math.PI but cases were found where it was exceeded.
 *
 * To find a curve for this, the ranges between highest and lowest probability estimate
 * for a certain cycle count were recorded for cycle counts between 0 and 2500.
 *
 * The trend resembled the well-known n/x curve but was softer, so n/sqrt(x) was a better fit.
 * 4 was selected as a "magic number" here since it safely bounded the most extreme ranges
 * found at 100 samples.
 *
 * Certain hands were more "variable" than others, with subsequent tests yielding wider ranges.
 * These tended to occur with strong but not dominant hands with larger player counts.
 *
 * This should fail extremely rarely in tests, if ever.  If it does, consider increasing the magic number.
 * It may be too tolerant of slightly off values as it is tuned to include highly unlikely random events,
 * in order to reduce flakiness.
 * @param cycles
 */
function findVariance(cycles: number):number {
    return BOUND / Math.sqrt(cycles);
}
function withinRange(expected: number, actual: number, cycles: number): boolean {
    const variance = findVariance(cycles);
    const diff = Math.abs(expected - actual);
    return diff < variance/2;
}

/**
 * Based on probabilities taken from https://homes.luddy.indiana.edu/kapadia/nofoldem/
 */
describe('PokerEvaluator', () => {
    describe('calculates hole card odds', () => {
        it('pocket aces', () => {
            expect(withinRange(0.5578, winningOdds(['as','ac'],[], DEFAULT_PLAYER_COUNT, DEFAULT_CYCLES), DEFAULT_CYCLES)).toBeTruthy();
        })
    })
})
