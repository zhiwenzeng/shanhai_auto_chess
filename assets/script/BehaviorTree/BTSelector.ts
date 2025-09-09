import { BTState } from "./BTNode";
import { BTComposite } from "./BTComposite";

export class BTSelector extends BTComposite {
    public execute(deltaTime: number): BTState {
        super.execute(deltaTime);
        if (this._children.length === 0) return BTState.Failure;
        const currentChild = this._children[this._currentChildIndex];
        const result = currentChild.execute(deltaTime);
        if (result === BTState.Running) return BTState.Running;
        currentChild.exit();
        if (result === BTState.Success) return BTState.Success;
        if (++this._currentChildIndex >= this._children.length) {
            return BTState.Failure;
        }
        this._children[this._currentChildIndex].enter();
        return BTState.Running;
    }
}