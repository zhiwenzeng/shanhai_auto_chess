import { BTState } from "./BTNode";
import { BTDecorator } from "./BTDecorator";

export class BTInverter extends BTDecorator {
    public execute(deltaTime: number): BTState {
        if (!this._child) return BTState.Failure;
        const result = this._child.execute(deltaTime);
        switch(result) {
            case BTState.Success: return BTState.Failure;
            case BTState.Failure: return BTState.Success;
            default: return result;
        }
    }
}