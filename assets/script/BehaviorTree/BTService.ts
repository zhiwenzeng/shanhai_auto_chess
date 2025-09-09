import { Blackboard } from "./Blockboard";

export abstract class BTService {
    protected _interval: number;
    protected _elapsed: number;
    protected _blackboard: Blackboard;
    protected _owner: any;
    constructor(interval: number) {
        this._interval = interval;
        this._elapsed = interval;
    }
    public setBlackboard(blackboard: Blackboard) {
        this._blackboard = blackboard;
    }
    public setOwner(owner: any) {
        this._owner = owner;
    }
    public update(dt: number): void {
        this._elapsed += dt;
        if (this._elapsed >= this._interval) {
            this.execute(this._interval, dt);
            this._elapsed -= this._interval;
        }
    }
    public abstract execute(interval: number, dt: number);
}