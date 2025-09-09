import { Blackboard } from "./Blockboard";
import { BTNode } from "./BTNode";
import { BTRoot } from "./BTRoot";

export class BehaviorTree {
    private _root: BTRoot;
    private _enable: boolean;
    constructor(active: BTNode, owner: any) {
        this._root = new BTRoot(active, new Blackboard(), owner);
        this._enable = false;
    }
    public get blackboard(): Blackboard {
        return this._root.blackboard;
    }
    public get owner(): any {
        return this._root.owner;
    }
    public get enable(): boolean {
        return this._enable;
    }
    public set enable(value: boolean) {
        if (this._enable === value) return;
        this._enable = value;
        value ? this._root.start() : this._root.stop();
    }
    public update(deltaTime: number): void {
        if (!this._enable) return;
        this._root.execute(deltaTime);
    }
}