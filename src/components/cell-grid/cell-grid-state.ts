export interface CellGridState {
    cycle: number;
    cellMap: Array<Array<number>>;
    interruptCycle: boolean;
    alreadyComputing: boolean;
}
