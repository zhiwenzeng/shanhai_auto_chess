import { _decorator, Component, Node, Animation, __private, AnimationClip } from 'cc';
import { AComponent } from '../AComponent';
import { TimerManager } from '../Manager/TimerManager';
import { TFunction } from '../Common/Define';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('AnimationComponent')
@requireComponent(Animation)
export class AnimationComponent extends AComponent {
    public onStop: TFunction = null;
    public onFinish: TFunction = null;
    private _inner: Animation = null;
    private _clipMap: Map<string, AnimationClip> = new Map();
    private _isStop: boolean = true;
    private _currentClipTimer: number = 0;
    private _currentClipName: string = "";
    public get currentClipName(): string {
        return this._currentClipName;
    }
    public get currentClip(): AnimationClip {
        return this._clipMap.get(this._currentClipName);
    }
    public setOwner(owner: any) {
        super.setOwner(owner);
        this._inner = this.getComponent(Animation);
        for (let clip of this._inner.clips) {
            this._clipMap.set(clip.name, clip);
        }
    }
    protected update(dt: number): void {
        let currentClip = this.currentClip;
        if (currentClip == null) {
            return;
        }
        this._currentClipTimer += dt;
        // @ts-ignore
        if (this._currentClipTimer >= currentClip._duration) {
            if (currentClip.wrapMode == AnimationClip.WrapMode.Normal || currentClip.wrapMode == AnimationClip.WrapMode.Reverse) {
                this.stop();
                this.onFinish?.();
            }
        }
    }
    public play(name: string): void {
        let currentClip = this.currentClip;
        if (currentClip && this._currentClipName == name) {
            if (currentClip.wrapMode == AnimationClip.WrapMode.Loop) {
                return;
            }
        }
        if (!this._clipMap.has(name)) {
            return;
        }
        this.stop();
        this._inner.play(name);
        this._isStop = false;
        this._currentClipTimer = 0;
        this._currentClipName = name;
    }
    public stop(): void {
        if (!this._isStop) {
            this._isStop = true;
            this.onStop?.();
        }
    }
}

