import { Blackboard } from "./Blockboard";

export enum BTState {
    Inactive = "Inactive",
    Running = "Running",
    Success = "Success",
    Failure = "Failure"
}

export abstract class BTNode {
    protected _state: BTState = BTState.Inactive;
    protected _blackboard: Blackboard;
    protected _owner: any;
    public setBlackboard(blackboard: Blackboard) {
        this._blackboard = blackboard;
    }
    public setOwner(owner: any) {
        this._owner = owner;
    }
    public enter(): void {
        this._state = BTState.Running;
    }
    public abstract execute(deltaTime: number): BTState;
    public exit(): void {
        this._state = BTState.Inactive;
    }
    public abort(): void {
        if (this._state === BTState.Running) {
            this.exit();
        }
    }
}