import ThreeCardConverter from './three-card-converter';

describe('ThreeCardConverter', () => {
  it('fills a 3 card hand', () => {
    const threeCardInput = ['As', 'Ks', 'Qs'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '2s', '3d']);
  });

  it('avoids improving the hand to a straight', () => {
    const threeCardInput = ['4s', '5d', '6c'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '2s', '7d']);
  });

  it('avoids improving the hand to a straight when using 2s/3d', () => {
    const threeCardInput = ['As', '2s', '3d'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '4s', '6d']);
  });

  it('test 1 for more coverage before refactoring class', () => {
    const threeCardInput = ['As', 'Ad', 'Ac'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '2s', '3d']);
  });

  it('avoids improving the hand to a pair', () => {
    const threeCardInput = ['2c', '3c', 'Ks'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '4s', '5d']);
  });

  it('avoids improving the hand to 2-pair', () => {
    const threeCardInput = ['2s', '2d', '3h'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '4s', '5d']);
  });

  it('avoids improving the hand to trips (from a pair of 2\'s)', () => {
    const threeCardInput = ['2c', '2d', 'Ks'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '3s', '4d']);
  });

  it('avoids improving the hand to trips (from pair of 3\'s)', () => {
    const threeCardInput = ['3s', '3d', 'Ks'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '2s', '4d']);
  });

  it('avoids improving the hand to trips (from pair of A\'s)', () => {
    const threeCardInput = ['As', 'Ad', 'Ks'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '2s', '3d']);
  });

  it('avoids improving the hand to quads (from trip 2\'s)', () => {
    const threeCardInput = ['2c', '2d', '2h'];
    const result = ThreeCardConverter.fillHand(threeCardInput);
    expect(result).toEqual([...threeCardInput, '3s', '4d']);
  });
});
