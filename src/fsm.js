class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this.clearHistory();
        this.config = config;
        this.changeState(config.initial);
        this.blockRedo = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states.hasOwnProperty(state)) {
            throw new Error(`State ${state} not exists`);
        }
        this.undoStack.push(state);
        this.undoPosition++;
        this.state = state;
        this.blockRedo = true;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.changeState(this.config.states[this.getState()].transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.changeState(this.config.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event === undefined) {
            return Object.keys(this.config.states);
        }
        return this.searchState(event);
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.undoStack[this.undoPosition - 1]) {
            return false;
        }
        this.state = this.undoStack[this.undoPosition - 1];
        this.undoPosition--;
        this.blockRedo = false;
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this.blockRedo) {
            return false;
        }
        if (!this.undoStack[this.undoPosition + 1]) {
            return false;
        }
        this.state = this.undoStack[this.undoPosition + 1];
        this.undoPosition++;
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undoPosition = -1;
        this.undoStack = [];
    }

    searchState (event) {
        let result = [];
        for (let state in this.config.states) {
            if (this.config.states[state].transitions.hasOwnProperty(event)) {
                result.push(state);
            }
        }
        return result;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
