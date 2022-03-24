
const randomBool = () => {
    return Math.random() < 0.6 
}
// No state is maintained here we just take the input and return something
const getGameOfLife = (rows, cols) => {

    const applyToCellMap = async (map, func) => {
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                const item = map[i * cols + j]
                map[i * cols + j] = await func(map[i * cols + j], i * cols +j, i, j)
            }
        }
        return map
    }

     const emptyCellMap = async () => await applyToCellMap(new Array(rows * cols).fill(null), async (item, arrayIndex, i, j) => {
            return {
                x: j,
                y: i,
                isAlive: false,
                diedSinceLastGeneration: false,
                neighbourSum: 0
            }
        })


    const randomNewGen = async () => {
        console.log('RANDOM NEW GEN!!!')
        const emptyMap = await emptyCellMap()
        const randomCellMap = await applyToCellMap(emptyMap, async (item, arrayIndex, i, j) => {
            return {
                x: j,
                y: i,
                isAlive: randomBool(),
                diedSinceLastGeneration: false,
                neighbourSum: 0
            }
        })
        console.log(randomCellMap)
        return randomCellMap
    }

    const sumOfNeighboursArray = async (map) => {
        console.log('SUMS !!!!')
        // This function returns an array with the neighbour count of the element on each element's index in
        const arrayOfSums = await applyToCellMap(map, async (item, arrayIndex, i, j) => {
            let sum = 0
            const leftException = (arrayIndex + 1) % cols === 1
            const rightException = (arrayIndex + 1) % cols === 0
            const upException = (arrayIndex - cols) < 0
            const downException = (arrayIndex + cols) > rows * cols - 1

            // NOTE: '+' boolean returns the number version '+' operator before a variable acts as a quick number converter 
            // NOTE: but this is slow af in chrome so a turnary is the fastest option but a close second option is bool | 0

            //adding left neighbour with except condition
            sum += leftException ? 0 : map[arrayIndex - 1].isAlive | 0
            //adding right neighbour with except condition
            sum += rightException ? 0 : map[arrayIndex + 1].isAlive | 0
            //adding up neighbour with except condition
            sum +=  upException ? 0 : map[arrayIndex - cols].isAlive | 0
            //adding down neighbour with except condition
            sum += downException ? 0 : map[arrayIndex + cols].isAlive | 0

            //adding left-up neighbour with except condition
            sum += leftException || upException ? 0 : map[arrayIndex - cols - 1].isAlive | 0
            //adding right-up neighbour with except condition
            sum += rightException || upException ? 0 : map[arrayIndex - cols + 1].isAlive | 0
            //adding left-down neighbour with except condition
            sum += leftException || downException ? 0 : map[arrayIndex + cols - 1].isAlive | 0
            //adding left-up exception 
            sum += rightException || downException ? 0 : map[arrayIndex + cols + 1].isAlive | 0
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
    const cleanDeathFlags = async (map) => { 
        console.log('CLEAN DEATH FLAGS')
        const sanitizedArray = await applyToCellMap(map, async (item, arrayIndex, i, j) => {
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

    const getNewGen = async (prevMap) => {
        console.log('GET NEW GEN ')
        // first we clean the map of death flags as we are generating a new one and they aren't relevant anymore
        const sanitizedArray = await cleanDeathFlags(prevMap)
        // second we generate a neighbour array filled with the neighbour cound on each element's index
        const sumsOfNeighbours = await sumOfNeighboursArray(sanitizedArray)

        // thirdly we create a new generation based on the rules of the game
        const newGen =  await applyToCellMap(sumsOfNeighbours, async (item, arrayIndex, i, j) => {
            if (item.neighbourSum >= 2 && item.neighBourSum <=3){
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

    // we init the game with either a random starting state or the one that the user passed in if any
    return [randomNewGen, getNewGen, emptyCellMap, applyToCellMap]
}

export default getGameOfLife
