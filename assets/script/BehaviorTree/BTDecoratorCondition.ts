import { BTState } from "./BTNode";
import { BTDecorator } from "./BTDecorator";

export class BTDecoratorCondition extends BTDecorator {
    private _lastCondition: boolean = false;
    private _condition: () => boolean;
    protected get needEnterChild(): boolean {
        return this._condition();
    }
    constructor(condition: () => boolean) {
        super();
        this._condition = condition;
    }
    public execute(deltaTime: number): BTState {
        if (this._child == null) {
            return;
        }
        const current = this._condition();
        if (this._lastCondition && !current) {
            this._child.abort();
        }
        this._lastCondition = current;
        return current ? this._child.execute(deltaTime) : BTState.Failure;
    }
}