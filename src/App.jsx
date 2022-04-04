import './App.scss';
import * as React from "react";
import {AppContextHandler} from "./models/app-context";
import {AppStateContext} from './context';
import CellGrid from './components/cell-grid/cell-grid'
import { set } from 'lodash';
class App extends React.Component {
    appContextHandler: AppContextHandler;

    constructor(props: any) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.appContextHandler = new AppContextHandler(this.forceUpdate); // Init empty app context
        this.state = {
            isResizing: false
        }
    }
    componentDidMount() {
        window.addEventListener('resize',() => this.setState({isResizing: true}, ()=>{
            setTimeout(()=>{
                this.setState({isResizing:false})
            },100)
        }))
    }
    render() {
        return (
            <AppStateContext.Provider value={this.appContextHandler.getContextState()}>
                {!this.state.isResizing && <CellGrid resolution={10} cycleDuration={3000}/>}
            </AppStateContext.Provider>
        );
    }
}

export default App;
