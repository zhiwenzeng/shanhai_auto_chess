import { BTState } from "./BTNode";
import { BTDecorator } from "./BTDecorator";

export class BTRepeat extends BTDecorator {
    private _currentCount: number = 0;
    constructor(private repeatCount: number = -1) {
        super();
    }
    public enter(): void {
        super.enter();
        this._currentCount = 0;
    }
    public execute(deltaTime: number): BTState {
        if (!this._child) return BTState.Failure;
        while (this._currentCount < this.repeatCount || this.repeatCount === -1) {
            const result = this._child.execute(deltaTime);
            if (result === BTState.Running) return BTState.Running;
            if (result === BTState.Failure) return BTState.Failure;
            this._child.exit();
            this._currentCount++;
            this._child.enter();
        }
        return BTState.Success;
    }
}