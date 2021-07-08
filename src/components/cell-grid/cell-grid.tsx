import * as React from 'react';
import {CellGridProps} from "./cell-grid-props";
import {CellGridState} from "./cell-grid-state";
import {CellGridMap} from "./cell-grid-map";
import {CellContainer} from "../cell/cell-container";
import './cell-grid.scss';

export class CellGrid extends React.Component<CellGridProps, CellGridState> {
    constructor(props: CellGridProps) {
        super(props);
        this.state = {
            cycleValue: 0,
            cellMap: [[]],
            interruptCycle: false,
            alreadyComputing: false
        };
    }

    componentDidMount(): void {
        this.setState({cellMap: CellGridMap.constructCellMap(this.props.resolution)}, () => {
            setInterval(() => {
                if (!this.state.cycleValue) {
                    this.setState({cellMap: CellGridMap.constructCellMap(this.props.resolution)});
                }

                if (!this.state.interruptCycle || !this.state.alreadyComputing) {
                    this.computeNextGeneration();
                }
            }, 600);
        });
    }

    private computeNextGeneration() {
        this.setState({alreadyComputing: true}, () => {
            const currentCellMap = [...this.state.cellMap];
            let nextGenerationCellMap = new Array(currentCellMap.length).fill(null).map(el => new Array(currentCellMap.length));
            let cycleValue = 0;

            currentCellMap.forEach((cellRow, colIndex) => {
                cellRow.forEach((cellValue, rowIndex) => {
                    nextGenerationCellMap[colIndex][rowIndex] = CellGridMap.computeCellStateByNeighbors(currentCellMap, colIndex, rowIndex);

                    if (nextGenerationCellMap[colIndex][rowIndex])
                        cycleValue += 1;
                });
            });

            this.setState({
                cellMap: nextGenerationCellMap,
                cycleValue: cycleValue,
                alreadyComputing: false
            });
        });
    }

    private renderCellGrid(): React.ReactNode {
        return this.state.cellMap.map((cellRow, colIndex) => {
            return <div className='cell-col'>
                {
                    cellRow.map((cellValue, rowIndex) => {
                        return <div className='cell-row'>
                            <CellContainer posX={colIndex} posY={rowIndex}
                                           isAlive={!!cellValue}/>
                        </div>
                    })
                }
            </div>
        });
    }

    private restartGrid() {
        this.setState({interruptCycle: true}, () => {
            const newCellMap = CellGridMap.constructCellMap(48);
            this.setState({interruptCycle: false, cellMap: newCellMap});
        });
    }

    render(): React.ReactNode {
        return (
            <div className='cell-grid'>
                {!this.state.interruptCycle && this.renderCellGrid()}

                <div className='restart' onClick={() => this.restartGrid()}>
                    RESTART
                </div>
            </div>
        )
    }
}
