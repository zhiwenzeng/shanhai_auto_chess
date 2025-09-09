import { Blackboard } from "./Blockboard";
import { BTNode, BTState } from "./BTNode";

export class BTRoot {
    private _active: BTNode;
    private _blackboard: Blackboard;
    private _owner: Node;
    private _needLoop: boolean;
    private _isActive: boolean;
    public get blackboard() {
        return this._blackboard;
    }
    public get owner() {
        return this._owner;
    }
    constructor(active: BTNode, blackboard: Blackboard, owner: Node, needLoop: boolean = true) {
        this._active = active;
        this._owner = owner;
        this._active.setOwner(owner);
        this._blackboard = blackboard;
        this._active.setBlackboard(blackboard);
        this._needLoop = needLoop;
        this._isActive = false;
    }
    public execute(deltaTime: number): void {
        if (!this._isActive) return;
        const result = this._active.execute(deltaTime);
        if (result !== BTState.Running) {
            if (this._needLoop) {
                this._active.abort();
                this._active.enter();
            }
            else {
                this.stop();
            }
        }
    }
    public start(): void {
        if (!this._isActive) {
            this._isActive = true;
            this._active.enter();
        }
    }
    public stop(): void {
        if (this._isActive) {
            this._isActive = false;
            this._active.abort();
        }
    }
}