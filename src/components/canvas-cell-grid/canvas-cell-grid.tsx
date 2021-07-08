import * as React from 'react';
import { CellGridMap } from '../cell-grid/cell-grid-map';
import './canvas-cell-grid.scss';

export interface Props {
    resolution: number;
}

export interface State {
    canvasSize: [number, number];
    gridSize: {width: number, height: number};
}

export class CanvasCellGrid extends React.Component<Props, State> {
    canvas: React.RefObject<HTMLCanvasElement>;
    loopHandler: any;

    canvasSize: [number, number];
    gridSize: {width: number, height: number};
    cellMap: Array<Array<number>> | null;

    constructor(props: Props) {
        super(props);
        this.state = {
            canvasSize: [0, 0],
            gridSize: {width: 0, height: 0},
        };

        this.canvas = React.createRef();
        this.canvasSize = [0, 0];
        this.gridSize = {width: 0, height: 0};
        this.cellMap = null;
    }

    componentDidMount(): void {
        this.updateSizes()
        this.restartLoop()
        window.addEventListener('resize', this.resize)
    }

    private updateSizes = () => {
        const rect = this.canvas.current?.parentElement?.getBoundingClientRect();
        const canvasSize: [number, number] = [
            rect?.width || 0,
            rect?.height || 0,
        ];

        const resolution = this.props.resolution;
        this.gridSize = {
            width: Math.floor(canvasSize[0] / resolution),
            height: Math.floor(canvasSize[1] / resolution),
        }
        
        this.setState({ canvasSize })
    }

    resize = () => {
        this.updateSizes()
        this.restartLoop()
    }

    componentWillUnmount() {
        this.clearLoop();
        window.removeEventListener('resize', this.resize);
    }

    startLoop() {
        this.loopHandler = setInterval(() => {
            if (this.cellMap) {
                const nextGenerationCellMap = this.computeNextGeneration(this.cellMap);
                this.renderCellGrid(nextGenerationCellMap);
                this.cellMap = nextGenerationCellMap;
            } else {
                throw new Error('Attempted to start loop without cell map');
            }
        }, 500);
    }

    clearLoop() {
        if (this.loopHandler) {
            clearInterval(this.loopHandler);
            this.loopHandler = null;
        }
    }

    restartLoop = () => {
        this.clearLoop();

        this.cellMap = CellGridMap.constructCellMapV2(this.gridSize.width, this.gridSize.height);
        this.startLoop();
    }

    private computeNextGeneration(currentCellMap: number[][]) {
        let nextGenerationCellMap = new Array(currentCellMap.length).fill(null).map(el => new Array(currentCellMap.length));

        currentCellMap.forEach((cellRow, colIndex) => {
            cellRow.forEach((cellValue, rowIndex) => {
                nextGenerationCellMap[colIndex][rowIndex] = CellGridMap.computeCellStateByNeighbors(currentCellMap, colIndex, rowIndex);
            });
        });

        return nextGenerationCellMap;
    }

    private renderCellGrid(cellMap: Array<number>[]) {
        const xWidth = this.props.resolution;
        const yWidth = this.props.resolution;

        if (this.canvas.current) {
            const ctx = this.canvas.current.getContext('2d');
            if (ctx) {
                // clear area
                ctx.fillStyle = 'black'
                ctx.fillRect(0, 0, this.state.canvasSize[0], this.state.canvasSize[1])

                // draw cells
                cellMap.forEach((cellRow, rowIndex) => {
                    cellRow.forEach((cellValue, colIndex) => {
                        const isAlive = !!cellValue
                        ctx.fillStyle = isAlive ? 'blue' : 'black'
                        ctx.fillRect(xWidth * colIndex, yWidth * rowIndex, xWidth, yWidth);
                    })
    
                });
            } else {
                throw new Error('Failed to obtain 2D canvas context.');
            }
        } else {
            throw new Error('Canvas element not found.');
        }
    }

    render(): React.ReactNode {
        const width = this.state.canvasSize[0]
        const height = this.state.canvasSize[1]

        return (
            <div className='canvas-cell-grid'>
                <canvas ref={this.canvas} width={width} height={height}></canvas>

                <div className='restart' onClick={this.restartLoop}>
                    RESTART
                </div>
            </div>
        )
    }
}
