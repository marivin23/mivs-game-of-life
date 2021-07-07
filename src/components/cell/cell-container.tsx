import * as React from 'react';
import {AppStateContext} from "../../context";
import {Cell} from "./cell";
import {CellProps} from "./cell-props";

export class CellContainer extends React.Component<CellProps, any> {
    static contextType = AppStateContext;

    constructor(props: CellProps) {
        super(props);
    }

    render(): React.ReactNode {
        return <Cell {...this.props}/>
    }
}
