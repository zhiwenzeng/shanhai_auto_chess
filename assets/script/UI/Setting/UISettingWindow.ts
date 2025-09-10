import { _decorator, Component, Node, Toggle, Slider, Label } from 'cc';
import { UIWindow } from '../UIWindow';
import { AudioManager } from '../../Manager/AudioManager';
const { ccclass, property } = _decorator;

@ccclass('UISettingWindow')
export class UISettingWindow extends UIWindow {
    @property(Toggle) musicToggle: Toggle = null;
    @property(Toggle) effectToggle: Toggle = null;
    @property(Slider) musicSlider: Slider = null;
    @property(Slider) effectSlider: Slider = null;
    @property(Label) musicValue: Label = null;
    @property(Label) effectValue: Label = null;

    protected onShow(): void {
        // 读取当前设置（AudioManager 内部持久化），若需可扩展getters
        // 这里仅展示滑条值更新，默认范围0-1
        this._syncVolumeLabels();
    }

    public onToggleMusic(toggle: Toggle) {
        AudioManager.Instance.setMusicEnabled(toggle.isChecked);
    }

    public onToggleEffect(toggle: Toggle) {
        AudioManager.Instance.setEffectEnabled(toggle.isChecked);
    }

    public onMusicVolume(slider: Slider) {
        AudioManager.Instance.setMusicVolume(slider.progress);
        this._syncVolumeLabels();
    }

    public onEffectVolume(slider: Slider) {
        AudioManager.Instance.setEffectVolume(slider.progress);
        this._syncVolumeLabels();
    }

    private _syncVolumeLabels() {
        if (this.musicSlider && this.musicValue) this.musicValue.string = `${(this.musicSlider.progress*100)|0}%`;
        if (this.effectSlider && this.effectValue) this.effectValue.string = `${(this.effectSlider.progress*100)|0}%`;
    }
}

