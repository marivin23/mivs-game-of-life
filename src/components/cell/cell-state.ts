export default interface CellState {
    x: number;
    y: number;
    isAlive: boolean;
    diedSinceLastGeneration: boolean;
    neighbourSum: number;
}
