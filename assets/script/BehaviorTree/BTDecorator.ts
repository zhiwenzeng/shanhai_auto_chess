import { Blackboard } from "./Blockboard";
import { BTNode, BTState } from "./BTNode";

export abstract class BTDecorator extends BTNode {
    protected _child: BTNode;
    protected get needEnterChild(): boolean {
        return true;
    }
    public setBlackboard(blackboard: Blackboard) {
        super.setBlackboard(blackboard);
        if (this._child) {
            this._child.setBlackboard(blackboard);
        }
    }
    public setOwner(owner: Node) {
        super.setOwner(owner);
        if (this._child) {
            this._child.setOwner(owner);
        }
    }
    public addChild(child: BTNode): void {
        child.setBlackboard(this._blackboard);
        child.setOwner(this._owner);
        this._child = child;
    }
    public abstract execute(deltaTime: number): BTState;
    public enter(): void {
        super.enter();
        if (this._child == null) {
            return;
        }
        if (this.needEnterChild) {
            this._child.enter();
        }
    }
    public exit(): void {
        super.exit();
        if (this._child == null) {
            return;
        }
        this._child.exit();
    }
    public abort(): void {
        super.abort();
        if (this._child == null) {
            return;
        }
        this._child.abort();
    }
}