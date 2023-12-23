export type PlayerOdds = {
    winRate: number;
    splitRates: Split[];
}

export type TableOdds = {
    players: PlayerOdds[];
}

export type Split = {
    rate: number;
    ways: number;
}