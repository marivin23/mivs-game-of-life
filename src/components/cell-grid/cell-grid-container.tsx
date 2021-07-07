import * as React from 'react';
import {CellGrid} from "./cell-grid";
import {CellGridProps} from "./cell-grid-props";
import {AppStateContext} from "../../context";

export class CellGridContainer extends React.Component<CellGridProps, any> {
    static contextType = AppStateContext;

    constructor(props: CellGridProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <CellGrid {...this.props}/>
        )
    }
}
