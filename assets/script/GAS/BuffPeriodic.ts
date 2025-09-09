import { _decorator } from "cc";
import { AttributeSet } from "./AttributeSet";
import { Buff } from "./Buff";
import { TagContainer } from "./TagContainer";

const { ccclass, property } = _decorator;

class BuffPeriodic extends Buff {
    public duration: number;
    public interval: number;
    private _timer: number = 0;
    private _isFinished: boolean = false;
    activate(attributeSet: AttributeSet, tags: TagContainer): void {
        super.activate(attributeSet, tags);
        this._timer = 0;
        this._isFinished = false;
    }
    update(dt: number): void {
        super.update(dt);
        if (!this._isFinished) {
            this._timer += dt;
            if (this._timer >= this.interval) {
                this._timer -= this.interval;
                this.modifiers.forEach(mod => 
                    this._attributeSet.applyBaseModifier(mod)
                );
            }
            if (this._timer >= this.duration) {
                this.deactivate();
            }
        }
    }
    deactivate(): void {
        this._isFinished = true;
        super.deactivate();
    }
    needUpdate(): boolean {
        return true;
    }
    isFinished(): boolean {
        return this._isFinished;
    }
}