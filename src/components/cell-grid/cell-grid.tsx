import * as React from 'react';
import {CellGridProps} from "./cell-grid-props";
import CellGridState from "./cell-grid-state";
import CellState from '../cell/cell-state';
import './cell-grid.scss';
import getGameOfLife from '../../hooks/getGameOfLife'

export class CellGrid extends React.Component<CellGridProps, CellGridState> {
    randomGame: () => Promise<Array<CellState>>
    getNextGeneration: (map: Array<CellState>) => Promise<Array<CellState>>
    emptyGame: () => Promise<Array<CellState>>
    mapToCellGrid: (map: Array<CellState>, func: (item: CellState, index: number, i: number, j: number ) => CellState) => Promise<Array<CellState>>
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
        const randomGameOfLife = await this.randomGame()
        console.log('in component did mount ')
        console.log('random game is ')
        console.log(randomGameOfLife)
        this.setState({cellMap: randomGameOfLife});

        setInterval(async () => {
            if (!this.state.cycleValue) {
                const randomGameOfLife = await this.randomGame()
                this.setState({cellMap: randomGameOfLife});
                console.log('Just set state to Random game which is ')
                console.log(randomGameOfLife)
            }

            if (!this.state.interruptCycle || !this.state.alreadyComputing) {
                this.computeNextGeneration();
            }
        }, 10000);
    }

    async computeNextGeneration() {
        console.log('COMPUTE NEXT GENERATION STATE IS : ')
        console.log(this.state)
        this.setState({alreadyComputing: true}, async () => {
            const currentCellMap = [...this.state.cellMap];
            console.log('old Cell map is ')
            console.log(currentCellMap)
            let nextGenerationCellMap = await this.getNextGeneration(currentCellMap)
            let cycleValue = 0;
            nextGenerationCellMap.forEach(cell => {
                if(cell.isAlive) cycleValue += 1
            })
            console.log('Next Generation Computed as')
            console.log(nextGenerationCellMap)
            console.log('Cycle value is ')
            console.log(cycleValue)
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
