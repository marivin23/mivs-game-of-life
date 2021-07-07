import {AppContextState} from "./app-context-state";
import {merge} from 'lodash';

export class AppContextHandler {
    private state: AppContextState;
    private readonly forceParentComponentUpdate: Function;

    constructor(forceParentComponentUpdate: Function) {
        this.state = {
            cycles: 0,
            updateContextState: this.updateContextState,
        };

        this.forceParentComponentUpdate = forceParentComponentUpdate;
    }

    private updateContextState = (newState: any) => {
        // - merge new state into the existing state of the context
        // - instantiate a new context object to trigger updates by AppStateContext.Provider
        // - force a render
        merge(this.state, newState);
        this.state = {...this.state};
        this.forceParentComponentUpdate();
    };

    getContextState() {
        return this.state;
    }
}
