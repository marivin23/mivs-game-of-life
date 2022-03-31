import './App.scss';
import * as React from "react";
import {AppContextHandler} from "./models/app-context";
import {AppStateContext} from './context';
import CellGrid from './components/cell-grid/cell-grid'
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

                <CellGrid resolution={50}/>

                <div className='contact-me-container'>
                    <a href='mailto: irimiemariusvictor@gmail.com' target='#'>Contact me!</a>
                </div>
            </AppStateContext.Provider>
        );
    }
}

export default App;
