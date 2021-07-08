export class CellGridMap {
    static constructCellMap(resolution: number): Array<Array<number>> {
        // console.log((window.innerWidth / resolution * 10) % 10);

        const gridDimensions = {
            width: Math.floor(window.innerWidth / resolution) + (Math.floor(window.innerWidth / resolution / 100) % 10),
            height: Math.floor(window.innerHeight / resolution) + (Math.floor(window.innerHeight / resolution / 100) % 10),
        };

        document.documentElement.style.setProperty('--cell-width', `${resolution}px`);

        return new Array(gridDimensions.height).fill(null).map(e => new Array(gridDimensions.width).fill(null).map(e => Math.round(Math.random())));
    }

    static constructEmptyMap(resolution: number) {
        const gridDimensions = {
            width: Math.floor(window.innerWidth / resolution),
            height: Math.floor(window.innerHeight / resolution)
        };

        document.documentElement.style.setProperty('--cell-width', `${resolution}px`);

        return new Array(gridDimensions.height).fill(null).map(e => new Array(gridDimensions.width).fill(null).map(e => 0));
    }

    static computeCellStateByNeighbors(cellMap: Array<Array<number>>, cellPosX: number, cellPosY: number): boolean {
        let currentCellValue: any = cellMap[cellPosX][cellPosY];
        let neighborCount = 0;

        for (let i = -1; i < 2; i++) {
            // Check left
            if (cellPosX - 1 < 0)
                continue;

            // Check right
            if (cellPosX + 1 > cellMap.length - 1)
                continue;

            // Check top
            if (cellPosY - 1 < 0)
                continue;

            // Check bottom
            if (cellPosY + 1 > cellMap[0].length - 1)
                continue;

            for (let j = -1; j < 2; j++) {
                // Don't take into account current cell
                if (i === 0 && j === 0)
                    continue;

                if (cellMap[cellPosX + i][cellPosY + j])
                    neighborCount += 1;
            }
        }

        if (currentCellValue) {
            if (![2, 3].includes(neighborCount))
                currentCellValue = 0;
        } else {
            if (neighborCount === 3)
                currentCellValue = 1;
        }

        return !!currentCellValue;
    }
}
