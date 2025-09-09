import { StateMachine } from "./StateMachine";

export class State {
    private _owner: StateMachine;
    public get owner(): StateMachine { return this._owner; }
    constructor(owner: StateMachine) {
        this._owner = owner;
    }
    enter() {}
    update() {}
    exit() {}
}


