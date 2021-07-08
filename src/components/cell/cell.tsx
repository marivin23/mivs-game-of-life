import * as React from 'react';
import {CellProps} from "./cell-props";
import {CellState} from "./cell-state";
import './cell.scss';

export class Cell extends React.Component<CellProps, CellState> {
    constructor(props: CellProps) {
        super(props);
        this.state = {
            posX: props.posX,
            posY: props.posY,
            isAlive: props.isAlive || false,
            cellColor: ''
        };
    }

    componentDidMount(): void {
        this.setState({cellColor: 'color-' + Cell.computeCellColor()});
    }

    private static computeCellColor() {
        return Math.floor(Math.random() * 4)
    }

    render(): React.ReactNode {
        return (
           <div className={`cell ${this.props.isAlive ? this.state.cellColor : 'dead'}`}>
               {this.props.isAlive || ""}
           </div>
       )
    }
}
