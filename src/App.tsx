import './App.scss';
import * as React from "react";
import {AppContextHandler} from "./models/app-context";
import {AppStateContext} from './context';
import {CellGridContainer} from "./components/cell-grid/cell-grid-container";

class App extends React.Component {
    appContextHandler: AppContextHandler;

    constructor(props: any) {
        super(props);
        this.forceUpdate = this.forceUpdate.bind(this);
        this.appContextHandler = new AppContextHandler(this.forceUpdate); // Init empty app context
    }

    render() {
        return (
            <AppStateContext.Provider value={this.appContextHandler.getContextState()}>
                <div className='wip-site'>
                    Currently the site's status is: WIP
                </div>

                <CellGridContainer cols={4} rows={4}/>

                <div className='contact-me-container'>
                    <a href='mailto: irimiemariusvictor@gmail.com' target='#'>Contact me!</a>
                </div>
            </AppStateContext.Provider>
        );
    }
}

export default App;
