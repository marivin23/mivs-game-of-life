import * as React from 'react';

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, OrthographicCamera } from '@react-three/drei'
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import Cell from '../cell/cell'
import './cell-grid.scss';

const randomBool = () => {
    return Math.random() < 0.3
}
const calculateCameraDistance = (height, fov) => {
    return height / 2 / Math.tan(Math.PI * fov / 360);
}
export class CellGrid extends React.Component{
    width
    height
    cellSize
    rows
    cols
    constructor(props) {
        super(props);
        this.state = {
            cycleValue: 0,
            cellMap: [],
            interruptCycle: false,
            alreadyComputing: false
        };
        this.myRef = React.createRef()
        this.applyToMap = (map, func) => {
            let newMap = new Array(this.cols * this.rows)
            for(let i = 0; i < this.rows; i++){
                for(let j = 0; j < this.cols; j++){
                    newMap[i * this.cols + j] = func(map[i * this.cols + j], i * this.cols +j, i, j)
                }
            }
            return newMap 
        }

        this.emptyMap = () => this.applyToMap(new Array(this.rows * this.cols).fill({
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
                const leftException = arrayIndex % this.cols === 0
                const rightException = arrayIndex % this.cols === this.cols - 1
                const upException = (arrayIndex - this.cols) < 0
                const downException = (arrayIndex + this.cols) > this.rows * this.cols - 1

                // NOTE: '+' boolean returns the number version '+' operator before a variable acts as a quick number converter
                // NOTE: but this is slow af in chrome so a turnary is the fastest option but a close second option is bool | 0

                //adding left neighbour with except condition
                sum += leftException ? 0 : (map[arrayIndex - 1].isAlive ? 1 : 0) 
                //adding right neighbour with except condition
                sum += rightException ? 0 : (map[arrayIndex + 1].isAlive ? 1 : 0)
                //adding up neighbour with except condition
                sum +=  upException ? 0 : (map[arrayIndex - this.cols].isAlive ? 1 : 0)
                //adding down neighbour with except condition
                sum += downException ? 0 : (map[arrayIndex + this.cols].isAlive ? 1 : 0)

                //adding left-up neighbour with except condition
                sum += leftException || upException ? 0 : (map[arrayIndex - this.cols - 1].isAlive ? 1 : 0)
                //adding right-up neighbour with except condition
                sum += rightException || upException ? 0 : (map[arrayIndex - this.cols + 1].isAlive ? 1 : 0)
                //adding left-down neighbour with except condition
                sum += leftException || downException ? 0 : (map[arrayIndex + this.cols - 1].isAlive ? 1 : 0)
                //adding left-up exception
                sum += rightException || downException ? 0 : (map[arrayIndex + this.cols + 1].isAlive ? 1 : 0)

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
        // sets all diedSinceLastGeneration to false AND cleans the neighbourhood sum
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
                if (item.isAlive){
                    //Any live cell with 2 or 3 neighbours survives
                    //All other live cells die in the next generation.
                    if (item.neighbourSum === 2 || item.neighbourSum === 3){
                        return {
                            x: item.x,
                            y: item.y,
                            isAlive: true,
                            diedSinceLastGeneration: false,
                            neighbourSum: item.neighbourSum
                        }
                    }

                    return {
                        x: item.x,
                        y: item.y,
                        isAlive: false,
                        diedSinceLastGeneration: true,
                        neighbourSum: 0
                    }
                } else {
                    // Any dead cell with 3 neighbours comes to life
                    // All other dead cells remain dead
                    if(item.neighbourSum === 3){
                        return {
                            x: item.x,
                            y: item.y,
                            isAlive: true,
                            diedSinceLastGeneration: false,
                            neighbourSum: item.neighbourSum
                        }
                    }

                    return {
                        x: item.x,
                        y: item.y,
                        isAlive: false,
                        diedSinceLastGeneration: false,
                        neighbourSum: 0
                    }
                }
            })

            // last step is setting the new state and returning the requested new generation
            return newGen
        }


    }
    componentDidMount() {
        console.log('DIDMOUNT')
        this.width = this.myRef.current.clientWidth;
        this.height = this.myRef.current.clientHeight;
        this.cellSize = this.width / this.props.resolution;
        this.cols =  Math.floor(this.width / this.cellSize);
        this.rows = Math.floor(this.height / this.cellSize);
        console.log(this.rows)
        console.log(this.cols)
        const randomGameOfLife = this.randomMap()
        this.setState({cellMap: randomGameOfLife});

        setInterval(() => this.handleCurrentCycle(), 5000);
    }

    handleCurrentCycle() {
        if (!this.state.cycleValue) {
            const randomGameOfLife = this.randomMap()
            this.setState({cellMap: randomGameOfLife});
        }

        if (!this.state.interruptCycle || !this.state.alreadyComputing) {
            this.computeNextGeneration(this.state);
        }
    }

    computeNextGeneration(currentState) {
        const currentCellMap = currentState.cellMap;
        this.setState({alreadyComputing: true}, () => {
            let nextGenerationCellMap = this.getNewGen(currentCellMap)
            let cycleValue = 0;
            nextGenerationCellMap.forEach(cell => {
                if(cell.isAlive) cycleValue += 1
            })
            nextGenerationCellMap = this.sumOfNeighboursMap(nextGenerationCellMap)
            this.setState({
                cellMap: nextGenerationCellMap,
                cycleValue: cycleValue,
                alreadyComputing: false
            });
        });
    }
    calculateCameraZoom(){
            return this.width / ( this.rows * this.cellSize )
    }
    renderCellGrid() {
        const cells = this.state.cellMap.map((cell, index)=>{
            return <Cell 
                key={index} 
                cell={cell}
                size={this.cellSize}
                screenW={this.width}
                screenH={this.height}
                position={{
                    y: this.cellSize / 2 + cell.y * this.cellSize,
                    x: this.cellSize / 2 + cell.x * this.cellSize, 
                    z: 0
                }} 
                
            />
        })
        const DISTANCE_FROM_CAMERA = 300
        return <Canvas
                    className= "fiberCanvas"
                    shadows
                >
                    <ambientLight intensity={1} />
                    <OrthographicCamera makeDefault left={0} right={this.cellSize * this.cols} top={this.cellSize * this.rows} bottom={0}>
                        <group rotation={[0,0,0]} lookAt={[0, 0, 0]} position={[0, 0, -DISTANCE_FROM_CAMERA]}>
                            {cells}
                        </group>
                    </OrthographicCamera>
                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={1} height={50} />
                    </EffectComposer>
                </Canvas>
    }

    async restartGrid() {
        this.setState({interruptCycle: true}, () => {
            const newCellMap = this.randomMap() 
            this.setState({interruptCycle: false, cellMap: newCellMap});
        });
    }

    render() {
        return (
            <div ref={this.myRef} className='cell-grid'>
                {!this.interruptCycle && this.renderCellGrid()}
                <div className='restart' onClick={async () => await this.restartGrid()}>
                    RESTART
                </div>
            </div>
        )
    }
}

export default CellGrid
