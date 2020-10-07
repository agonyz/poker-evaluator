import PokerEvaluator = require('./poker-evaluator');

describe('PokerEvaluator', () => {
  describe('throws on invalid input when', () => {
    it('4 cards', () => {
      expect(() => PokerEvaluator.evalHand(['As', 'Ac', 'Ad', '5s'])).toThrow();
    });

    it('8 cards', () => {
      expect(() => PokerEvaluator.evalHand(['As', 'Ac', 'Ad', '5s', 'Ad', 'Ah', '5c', '5s'])).toThrow();
    });

    it('non-card strings', () => {
      expect(() => PokerEvaluator.evalHand(['not', 'valid', 'cards'])).toThrow();
    });

    it('includes empty strings', () => {
      expect(() => PokerEvaluator.evalHand(['', '5d', '8c'])).toThrow();
    });

    it('includes undefined', () => {
      expect(() => PokerEvaluator.evalHand([undefined, 'As', 'Ks'])).toThrow();
    });
  });

  describe('string input', () => {
    describe('7 cards', () => {
      it('straight flush', () => {
        expect(
          PokerEvaluator.evalHand(['As', 'Ks', 'Qs', 'Js', 'Ts', '3c', '5h'])
        ).toEqual({
          handType: 9,
          handRank: 10,
          value: 36874,
          handName: 'straight flush',
        });
      });

      it('quads', () => {
        expect(
          PokerEvaluator.evalHand(['As', 'Ac', 'Ah', 'Ad', '2c', '3c', '4c'])
        ).toEqual({
          handType: 8,
          handRank: 147,
          value: 32915,
          handName: 'four of a kind'
        });
      });

      it('flush', () => {
        expect(
          PokerEvaluator.evalHand(['8c', '2c', '3c', 'Tc', 'Jc', '4s', '4d'])
        ).toEqual({
          handType: 6,
          handRank: 212,
          value: 24788,
          handName: 'flush',
        });
      });

      it('straight', () => {
        expect(
          PokerEvaluator.evalHand(['Ah', '2d', '3c', '4h', '5d', 'Tc', 'Td'])
        ).toEqual({
          handType: 5,
          handRank: 1,
          value: 20481,
          handName: 'straight',
        });
      });
    });

    describe('5 cards', () => {
      it('full house', () => {
        expect(PokerEvaluator.evalHand(['As', 'Ac', 'Ad', '5d', '5s'])).toEqual({
          handType: 7,
          handRank: 148,
          value: 28820,
          handName: 'full house',
        });
      });

      it('invalid hand', () => {
        expect(PokerEvaluator.evalHand(['2c', '2c', '2c', '2c', '2c'])).toEqual({
          handType: 0,
          handRank: 0,
          value: 0,
          handName: 'invalid hand',
        });
      });
    });

    describe('3 cards', () => {
      it('one pair', () => {
        expect(PokerEvaluator.evalHand(['As', 'Ac', 'Qs'])).toEqual({
          handType: 2,
          handRank: 2761,
          value: 10953,
          handName: 'one pair',
        });
      });

      it('trips', () => {
        expect(PokerEvaluator.evalHand(['Qs', 'Qc', 'Qh'])).toEqual({
          handType: 4,
          handRank: 661,
          value: 17045,
          handName: 'three of a kind',
        });
      });

      it('high card', () => {
        expect(PokerEvaluator.evalHand(['2c', '7d', '9h'])).toEqual({
          handType: 1,
          handRank: 24,
          value: 4120,
          handName: 'high card',
        });
      });
    });
  });

  describe('number input', () => {
    it('7 cards: straight flush', () => {
      expect(
        PokerEvaluator.evalHand([52, 48, 44, 40, 36, 5, 15])
      ).toEqual({
        handType: 9,
        handRank: 10,
        value: 36874,
        handName: 'straight flush',
      });
    });

    it('5 cards: straight', () => {
      expect(
        PokerEvaluator.evalHand([17, 22, 27, 32, 33])
      ).toEqual({
        handType: 5,
        handRank: 6,
        value: 20486,
        handName: 'straight',
      });
    });

    // TODO Update ThreeCardConverter to accept numbers as well
    it('throws on 3 cards', () => {
      expect(() => PokerEvaluator.evalHand([5, 6, 50])).toThrow();
    });
  });
});
