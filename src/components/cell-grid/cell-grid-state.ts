import CellState from '../cell/cell-state'

export default interface CellGridState {
    cycleValue: number;
    cellMap: Array<CellState>;
    interruptCycle: boolean;
    alreadyComputing: boolean;
}
