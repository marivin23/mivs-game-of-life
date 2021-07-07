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
            isAlive: props.isAlive || false
        };
    }

    render(): React.ReactNode {
        return (
           <div className={`cell ${this.props.isAlive ? 'alive' : 'dead'}`}>
               {this.props.isAlive || ""}
           </div>
       )
    }
}
