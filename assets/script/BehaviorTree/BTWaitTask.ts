import { _decorator, Component, Node } from 'cc';
import { BTTask } from './BTTask';
import { BTState } from './BTNode';

export class BTWaitTask extends BTTask {
    private _timer: number;
    private _duration: number;
    constructor(duration: number) {
        super();
        this._duration = duration;
    }
    public enter(): void {
        this._timer = this._duration;
    }
    public execute(deltaTime: number): BTState {
        this._timer -= deltaTime;
        if (this._timer <= 0) {
            return BTState.Success;
        }
        return BTState.Running;
    }
}

