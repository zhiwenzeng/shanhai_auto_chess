import { BTState } from "./BTNode";
import { BTDecorator } from "./BTDecorator";

export class BTTimeout extends BTDecorator {
    private _elapsed: number = 0;
    constructor(private timeout: number) {
        super();
    }
    public enter(): void {
        super.enter();
        this._elapsed = 0;
    }
    public execute(deltaTime: number): BTState {
        if (!this._child) return BTState.Failure;
        this._elapsed += deltaTime;
        if (this._elapsed >= this.timeout) {
            this._child.abort();
            return BTState.Failure;
        }
        const result = this._child.execute(deltaTime);
        return result === BTState.Running ? BTState.Running : result;
    }
}