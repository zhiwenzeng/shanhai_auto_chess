import { BTState } from "./BTNode";
import { BTComposite } from "./BTComposite";

export class BTSequence extends BTComposite {
    public execute(deltaTime: number): BTState {
        super.execute(deltaTime);
        if (this._children.length === 0) return BTState.Success;
        const currentChild = this._children[this._currentChildIndex];
        const result = currentChild.execute(deltaTime);
        if (result === BTState.Running) return BTState.Running;
        currentChild.exit();
        if (result === BTState.Failure) return BTState.Failure;
        if (++this._currentChildIndex >= this._children.length) {
            return BTState.Success;
        }
        this._children[this._currentChildIndex].enter();
        return BTState.Running;
    }
}