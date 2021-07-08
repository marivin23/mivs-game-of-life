export interface CellGridState {
    cycleValue: number;
    cellMap: Array<Array<number>>;
    interruptCycle: boolean;
    alreadyComputing: boolean;
}
