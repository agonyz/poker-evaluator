import * as fs from 'fs';
import * as path from 'path';

import {DECK, DECK_KEYS, DECK_VALUES, HAND_TYPES} from './constants';
import { EvaluatedHand } from './types';
import ThreeCardConverter from './three-card-converter';

// This is outside the class so evalHand is static, to keep same api as @chenosaurus/poker-evaluator
const RANKS_DATA = fs.readFileSync(path.join(__dirname, '../data/HandRanks.dat'));

export function evalHand(cards: string[] | number[]): EvaluatedHand {
  if (!RANKS_DATA) {
    throw new Error('HandRanks.dat not loaded.');
  }

  if (cards.length !== 7
    && cards.length !== 6
    && cards.length !== 5
    && cards.length !== 3) {
    throw new Error(`Hand must be 3, 5, 6, or 7 cards, but ${cards.length} cards were provided`);
  }

  if (cardsAreValidStrings(cards)) {
    let stringCards = cards as string[];
    if (stringCards.length === 3) { // If a 3 card hand, fill in to make 5 card
      stringCards = ThreeCardConverter.fillHand(stringCards);
    }
    return evaluate(convertCardsToNumbers(stringCards));
  } else if (cardsAreValidNumbers(cards)) {
    if (cards.length === 3) {
      throw new Error(`Please supply 3 card hands as string[] of "cards" only.`);
    }
    return evaluate(cards as number[]);
  } else {
    throw new Error(`
      Please supply input as a valid string[] | number[] of "cards".
      See src/constants/deck.const.ts for the deck's values
    `);
  }
}

export function evalCard(card: number): number {
  return RANKS_DATA.readUInt32LE(card * 4);
}

function convertCardsToNumbers(cards: string[]): number[] {
  return cards.map(card => DECK[card.toLowerCase()]);
}

function cardsAreValidStrings(cards: string[] | number[]): boolean {
  return cards.every((card: string | number) =>
    typeof card === 'string' && DECK_KEYS.has(card.toLowerCase()));
}

function cardsAreValidNumbers(cards: string[] | number[]): boolean {
  return cards.every((card: string | number) =>
    typeof card === 'number' && DECK_VALUES.has(card));
}

function evaluate(cardValues: number[]): EvaluatedHand {
  let p = 53;
  cardValues.forEach(cardValue => p = evalCard(p + cardValue));

  if (cardValues.length === 5 || cardValues.length === 6) {
    p = evalCard(p);
  }

  return {
    handType: p >> 12,
    handRank: p & 0x00000fff,
    value: p,
    handName: HAND_TYPES[p >> 12]
  }
}

export function winningOdds (hand: string[], community: string[], playerCount: number, cycles: number): number {
  // Above 23 players, we run out of cards in a deck.  23 * 2 + 5 = 51
  if (playerCount > 23) {
    throw new Error("You may have at most 23 players.")
  }

  const numHand = convertCardsToNumbers(hand)
  const numCommunity = convertCardsToNumbers(community)
  const startingDeck = deckWithoutSpecifiedCards([...numHand, ...numCommunity]);
  let wins = 0;
  for (let i = 0 ; i < cycles ; i ++ ) {
    shuffleDeck(startingDeck);
    let deckPosition = 0;
    const interimCommunity = [...numCommunity];

    const holeCards = [numHand];
    for (let p = 1 ; p < playerCount ; p ++) {
      holeCards.push([startingDeck[deckPosition++], startingDeck[deckPosition++]]);
    }

    while (interimCommunity.length < 5) {
      interimCommunity.push(startingDeck[deckPosition++]);
    }

    const playerValue = evalHand([...holeCards[0], ...interimCommunity]).value;
    wins ++;

    for (let p = 1 ; p < playerCount ; p ++) {
      if (evalHand([...holeCards[p], ...interimCommunity]).value >= playerValue) {
        wins --;
        break;
      }
    }
  }

  return wins / cycles;
}

function deckWithoutSpecifiedCards (cards: number[]): number[] {
  const providedSet = new Set(cards);
  return Object.values(DECK).filter(name => !providedSet.has(name));
}
function shuffleDeck (deck: number[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
