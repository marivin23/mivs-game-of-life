import * as React from 'react';
import {CellGridProps} from "./cell-grid-props";
import CellGridState from "./cell-grid-state";
import CellState from '../cell/cell-state';
import './cell-grid.scss';
import getGameOfLife from '../../hooks/getGameOfLife'

export class CellGrid extends React.Component<CellGridProps, CellGridState> {
    randomGame: () => Array<CellState>
    getNextGeneration: (map: Array<CellState>) => Array<CellState>
    emptyGame: () => Array<CellState>
    mapToCellGrid: (map: Array<CellState>, func: (item: CellState, index: number, i: number, j: number ) => CellState) => Array<CellState>;
    constructor(props: CellGridProps) {
        super(props);
        this.state = {
            cycleValue: 0,
            cellMap: [],
            interruptCycle: false,
            alreadyComputing: false
        };
        [this.randomGame, this.getNextGeneration, this.emptyGame, this.mapToCellGrid] = getGameOfLife(4,4)
    }
    async componentDidMount(): Promise<any> {
        console.log("DID MOUNT")
        const randomGameOfLife = this.randomGame()
        this.setState({cellMap: randomGameOfLife});

        setInterval(() => this.handleCurrentCycle(), 5000);
    }

    handleCurrentCycle() {
        if (!this.state.cycleValue) {
    const randomGameOfLife = this.randomGame()
    this.setState({cellMap: randomGameOfLife});
    console.log(randomGameOfLife);
}

if (!this.state.interruptCycle || !this.state.alreadyComputing) {
    this.computeNextGeneration(this.state);
}
    }

    async computeNextGeneration(currentState: any) {
        console.log("BULLSHIT");
        const currentCellMap = [...currentState.cellMap];
        this.setState({alreadyComputing: true}, async () => {
            console.log(currentCellMap, 'stateee')
            let nextGenerationCellMap = await this.getNextGeneration(currentCellMap)
            let cycleValue = 0;
            nextGenerationCellMap.forEach(cell => {
                console.log(cell);
                if(cell.isAlive) cycleValue += 1
            })
            this.setState({
                cellMap: nextGenerationCellMap,
                cycleValue: cycleValue,
                alreadyComputing: false
            });
        });
    }

    private renderCellGrid(): React.ReactNode {
        return <div className='Grid'>
        </div>
    }

    async restartGrid() {
        this.setState({interruptCycle: true}, async () => {
            const newCellMap = await this.randomGame() 
            this.setState({interruptCycle: false, cellMap: newCellMap});
        });
    }

    render(): React.ReactNode {
        console.log('RERENDER')
        return (
            <div className='cell-grid'>
                <h1>{this.state.cycleValue}</h1>
                {!this.state.interruptCycle && this.renderCellGrid()}

                <div className='restart' onClick={async () => await this.restartGrid()}>
                    RESTART
                </div>
            </div>
        )
    }
}
