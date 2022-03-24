export default interface CellState {
    x: number;
    y: number;
    isAlive: boolean;
    diedSinceLastGeneration: number;
    neighbourSum: 0;
}
