import { _decorator, CCString, Component, Label, Node, ProgressBar, tween, Tween } from 'cc';
import { UIWindow } from './UIWindow';
import { EventManager } from '../Manager/EventManager';
import { EEventType } from '../Common/Enums';
import { TimerManager } from '../Manager/TimerManager';
import { TFunction } from '../Common/Define';
const { ccclass, property } = _decorator;

@ccclass('UILoadingWindow')
export class UILoadingWindow extends UIWindow {

    @property(ProgressBar)
    public progressBar: ProgressBar;

    @property(Label)
    public tips: Label;

    @property(CCString)
    public tipsLoop: string[] = [
        "加载游戏中.", "加载游戏中..", "加载游戏中..."
    ];

    private _tipsIndex: number = -1;
    private _tween: Tween;
    private _setProgressCallback: TFunction;
    
    protected onOpen(): void {
        this._setProgressCallback = ((progress: number) => {
            this._setProgress(progress);
        }).bind(this);
        EventManager.Instance.on(EEventType.SetLoadingProgress, this._setProgressCallback);

        TimerManager.Instance.schedule(() => {
            this._tipsIndex = (this._tipsIndex + 1) % this.tipsLoop.length;
            this.tips.string = this.tipsLoop[this._tipsIndex];
        }, 0.5);
    }

    protected onClose(): void {
        EventManager.Instance.off(EEventType.SetLoadingProgress, this._setProgressCallback);
    }

    protected onShow(): void {
        this._setProgress(0);
    }

    private _setProgress(progress: number) {
        if (this._tween) {
            this._tween.stop();
            this._tween = null;
        }
        this._tween = tween(this.progressBar).to(0.5, { progress: progress }).start();
    }
}

