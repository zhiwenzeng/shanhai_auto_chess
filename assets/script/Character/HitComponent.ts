import { _decorator, CCFloat, Component, Material, Node, renderer, Sprite, v3 } from 'cc';
import { AComponent } from '../AComponent';
import { TimerManager } from '../Manager/TimerManager';
import { NONE } from '../Common/Define';
import { EffectManager } from '../Manager/EffectManager';

const { ccclass, property } = _decorator;

@ccclass('HitComponent')
export class HitComponent extends AComponent {
    private static Rate: number = 0.2;

    @property(Sprite)
    public hitRender: Sprite = null;

    private _hitMaterialPass: renderer.Pass = null;

    private _rate: number = 0;
    private _rateHandle: number = NONE;
    private _timer: number = NONE;
    private _onceTimer: number = NONE;
    private _lastHitTime: number = 0;

    protected onLoad(): void {
        let hitMaterial = this.hitRender.getMaterialInstance(0);
        this.hitRender.setMaterialInstance(hitMaterial, 0);
        this._hitMaterialPass = hitMaterial.passes[0];
        this._rateHandle = this._hitMaterialPass.getHandle("u_rate")
    }

    public playHitEffect(offsetY: number, duration: number = 0.6, repeat: number = 6): void {
        if (TimerManager.time - this._lastHitTime > duration) {
            this._lastHitTime = TimerManager.time;
            EffectManager.Instance.playHitEffect(this.getOwner(), this, v3(0, offsetY, 0));
        }
        this.play(duration, repeat);
    }

    public play(duration: number = 0.6, repeat: number = 6): void {
        TimerManager.Instance.unschedule(this._timer);
        this._timer = NONE;
        TimerManager.Instance.unschedule(this._onceTimer);
        this._onceTimer = NONE;
        this._rate = 1;
        this._timer = TimerManager.Instance.schedule(() => {
            if (this._rate >= 1) {
                this._rate = HitComponent.Rate;
            }
            else {
                this._rate = 1;
            }
            this._hitMaterialPass.setUniform(this._rateHandle, this._rate);
        }, duration / repeat);
        this._onceTimer = TimerManager.Instance.scheduleOnce(() => {
            this._hitMaterialPass.setUniform(this._rateHandle, 1);
            TimerManager.Instance.unschedule(this._timer);
            this._timer = NONE;
        }, duration);
    }

    protected onDestroy(): void {
        super.onDestroy();
        TimerManager.Instance.unschedule(this._timer);
        TimerManager.Instance.unschedule(this._onceTimer);
    }
}