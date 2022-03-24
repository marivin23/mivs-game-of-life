import * as React from 'react';
import {CellGridProps} from "./cell-grid-props";
import CellGridState from "./cell-grid-state";
import CellState from '../cell/cell-state';
import './cell-grid.scss';

const randomBool = () => {
    return Math.random() < 0.2
}

export class CellGrid extends React.Component<CellGridProps, CellGridState> {
    randomMap: () => Array<CellState>
    applyToMap: (map: Array<CellState>, func: (item: CellState, index: number, i: number, j: number ) => CellState) => Array<CellState>;
    emptyMap: () => Array<CellState>
    getNewGen: (map: Array<CellState>) => Array<CellState>
    sumOfNeighboursMap: (map: Array<CellState>) => Array<CellState>
    cleanDeathFlags: (map: Array<CellState>) => Array<CellState>

    constructor(props: CellGridProps) {
        super(props);
        this.state = {
            cycleValue: 0,
            cellMap: [],
            interruptCycle: false,
            alreadyComputing: false
        };

        this.applyToMap = (map, func) => {
            let newMap = new Array(this.props.cols * this.props.rows)
            for(let i = 0; i < this.props.rows; i++){
                for(let j = 0; j < this.props.cols; j++){
                    newMap[i * this.props.cols + j] = func(map[i * props.cols + j], i * props.cols +j, i, j)
                }
            }
            return newMap 
        }

        this.emptyMap = () => this.applyToMap(new Array(this.props.rows * this.props.cols).fill({
            x: 0,
            y: 0,
            isAlive: false,
            diedSinceLastGeneration: false,
            neighbourSum: 0
        }), (item, arrayIndex, i, j) => {
            return {
                x: j,
                y: i,
                isAlive: false,
                diedSinceLastGeneration: false,
                neighbourSum: 0
            }
        })

        this.randomMap = () => {
            const emptyMap = this.emptyMap()
            const randomCellMap = this.applyToMap(emptyMap, (item, arrayIndex, i, j) => {
                return {
                    x: j,
                    y: i,
                    isAlive: randomBool(),
                    diedSinceLastGeneration: false,
                    neighbourSum: 0
                }
            })
            return randomCellMap
        }

        this.sumOfNeighboursMap = (map) => {
        // This function returns an array with the neighbour count of the element on each element's index in
            const arrayOfSums = this.applyToMap(map, (item, arrayIndex, i, j) => {
                let sum = 0
                const leftException = (arrayIndex + 1) % this.props.cols === 1
                const rightException = (arrayIndex + 1) % this.props.cols === 0
                const upException = (arrayIndex - this.props.cols) < 0
                const downException = (arrayIndex + this.props.cols) > this.props.rows * this.props.cols - 1

                // NOTE: '+' boolean returns the number version '+' operator before a variable acts as a quick number converter
                // NOTE: but this is slow af in chrome so a turnary is the fastest option but a close second option is bool | 0

                //adding left neighbour with except condition
                sum += leftException ? 0 : (map[arrayIndex - 1].isAlive ? 1 : 0) 
                //adding right neighbour with except condition
                sum += rightException ? 0 : (map[arrayIndex + 1].isAlive ? 1 : 0)
                //adding up neighbour with except condition
                sum +=  upException ? 0 : (map[arrayIndex - this.props.cols].isAlive ? 1 : 0)
                //adding down neighbour with except condition
                sum += downException ? 0 : (map[arrayIndex + this.props.cols].isAlive ? 1 : 0)

                //adding left-up neighbour with except condition
                sum += leftException || upException ? 0 : (map[arrayIndex - this.props.cols - 1].isAlive ? 1 : 0)
                //adding right-up neighbour with except condition
                sum += rightException || upException ? 0 : (map[arrayIndex - this.props.cols + 1].isAlive ? 1 : 0)
                //adding left-down neighbour with except condition
                sum += leftException || downException ? 0 : (map[arrayIndex + this.props.cols - 1].isAlive ? 1 : 0)
                //adding left-up exception
                sum += rightException || downException ? 0 : (map[arrayIndex + this.props.cols + 1].isAlive ? 1 : 0)

                return {
                    x: item.x,
                    y: item.y,
                    isAlive: item.isAlive,
                    diedSinceLastGeneration: false,
                    neighbourSum: sum
                }
            })
            return arrayOfSums
        }
        // sets all diedSinceLastGeneration to false
        this.cleanDeathFlags = (map) => {
            const sanitizedArray = this.applyToMap(map, (item, arrayIndex, i, j) => {
                return {
                    x: j,
                    y: i,
                    isAlive: item.isAlive,
                    diedSinceLastGeneration: false,
                    neighbourSum: 0
                }
            })
            return sanitizedArray
        }

        this.getNewGen = (prevMap) => {
            // first we clean the map of death flags as we are generating a new one and they aren't relevant anymore
            const sanitizedArray = this.cleanDeathFlags(prevMap)
            // second we generate a neighbour array filled with the neighbour cound on each element's index
            const sumsOfNeighbours = this.sumOfNeighboursMap(sanitizedArray);


            // thirdly we create a new generation based on the rules of the game
            const newGen = this.applyToMap(sumsOfNeighbours, (item, arrayIndex, i, j) => {
                if (item.neighbourSum >= 2 && item.neighbourSum <=3){
                    return {
                        x: item.x,
                        y: item.y,
                        isAlive: true,
                        diedSinceLastGeneration: false,
                        neighbourSum: 0
                    }
                }else {
                    return {
                        x: item.x,
                        y: item.y,
                        isAlive: false,
                        diedSinceLastGeneration: prevMap[arrayIndex].isAlive ? true : false,
                        neighbourSum: 0
                    }
                }
            })
            // last step is setting the new state and returning the requested new generation
            return newGen
        }


    }
    componentDidMount() {
        console.log("DID MOUNT")
        const randomGameOfLife = this.randomMap()
        this.setState({cellMap: randomGameOfLife});

        setInterval(() => this.handleCurrentCycle(), 5000);
    }

    handleCurrentCycle() {
        console.log('handleCurrentCycle!!!!')
        if (!this.state.cycleValue) {
            const randomGameOfLife = this.randomMap()
            this.setState({cellMap: randomGameOfLife});
            console.log(' no cycleValue we set a random game in handleCurrentCycle first if')
            console.log(randomGameOfLife);
        }

        if (!this.state.interruptCycle || !this.state.alreadyComputing) {
            console.log('Attempting to compute a new generation in handleCurrentCycle second if')
            this.computeNextGeneration(this.state);
        }
    }

     computeNextGeneration(currentState: any) {
        const currentCellMap = currentState.cellMap;
        this.setState({alreadyComputing: true}, () => {
            console.log('inside setstate in computeNextGeneration the cellMap state is')
            console.log(currentCellMap)
            let nextGenerationCellMap = this.getNewGen(currentCellMap)
            let cycleValue = 0;
            nextGenerationCellMap.forEach(cell => {
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
        this.setState({interruptCycle: true}, () => {
            const newCellMap = this.randomMap() 
            this.setState({interruptCycle: false, cellMap: newCellMap});
        });
    }

    render(): React.ReactNode {
        console.log('RERENDER')
        return (
            <div className='cell-grid'>
                <h1 style={{marginTop: '300px'}}>{this.state.cycleValue}</h1>
                {!this.state.interruptCycle && this.renderCellGrid()}

                <div className='restart' onClick={async () => await this.restartGrid()}>
                    RESTART
                </div>
            </div>
        )
    }
}
