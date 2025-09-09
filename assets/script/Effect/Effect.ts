import { _decorator, CCFloat, Component, Node, v3, Vec3 } from 'cc';
import { AComponent } from '../AComponent';
import { TimerManager } from '../Manager/TimerManager';
const { ccclass, property } = _decorator;

@ccclass('Effect')
export class Effect extends AComponent {
    @property(CCFloat)
    public duration: number = 0.5;

    private _follow: AComponent = null;
    private _offset: Vec3 = v3(0, 0, 0);

    protected update(dt: number): void {
        if (this._follow == null || this._follow.isDestroy) {
            return;
        }
        let worldPosition = v3(this._follow.worldPosition);
        Vec3.add(worldPosition, worldPosition, this._offset);
        this.worldPosition = worldPosition;
    }

    public play(follow: AComponent, offset: Vec3) {
        this._follow = follow;
        this._offset = offset;
        this.setSiblingIndex(this._follow.siblingIndex + 1);
        TimerManager.Instance.scheduleOnce(() => {
            this.kill();
        }, this.duration);
    }
}

