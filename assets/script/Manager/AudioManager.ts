import { _decorator, AudioClip, AudioSource, Component, director, Node, resources, sys, tween } from 'cc';
import { ASingleton } from '../ASingleton';
import { APool } from '../Pool/APool';
import { ResourceManager } from './ResourceManager';
import { TimerManager } from './TimerManager';
import { StorageUtil } from '../Util/StorageUtil';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends ASingleton {
    public static get Instance(): AudioManager {
        return this.getInstance(AudioManager);
    }

    // 背景音乐通道
    private _musicSource: AudioSource = new AudioSource();
    // 音效组件池
    private _pool: APool<AudioSource>;
    private readonly POOL_SIZE = 5;

    // 音量设置
    private _musicVolume: number = 1;
    private _effectVolume: number = 1;
    private _musicOn: boolean = true;
    private _effectOn: boolean = true;

    protected onInitialize(): void {
        // 背景音乐通道
        this._musicSource = this.addComponent(AudioSource);
        this._musicSource.loop = true;
        // 音效池
        this._pool = new APool(this.POOL_SIZE, () => {
            return this.addComponent(AudioSource);
        });
        // 加载本地设置
        this.loadSettings();
    }

    // 加载音频资源
    async loadAudio(path: string) {
        return await ResourceManager.Instance.loadAsync<AudioClip>(path);
    }

    // 播放背景音乐
    async playMusic(path: string, fadeDuration: number = 1) {
        const clip = await this.loadAudio(path);
        if (!this._musicOn || !clip) return;
        // 淡出当前音乐
        if (this._musicSource.playing) {
            tween(this._musicSource)
                .to(fadeDuration, { volume: 0 })
                .call(() => this._musicSource.stop())
                .start();
        }
        // 播放新音乐
        this._musicSource.clip = clip;
        this._musicSource.volume = this._musicOn ? this._musicVolume : 0;
        this._musicSource.play();
        // 淡入新音乐
        if (fadeDuration > 0) {
            this._musicSource.volume = 0;
            tween(this._musicSource)
                .to(fadeDuration, { volume: this._musicVolume })
                .start();
        }
    }

    // 播放音效
    async playEffect(path: string) {
        if (!this._effectOn) return;
        const clip = await this.loadAudio(path);
        const source = this.getAvailableEffectSource();
        if (source && clip) {
            source.stop();
            source.volume = this._effectVolume;
            source.clip = clip;
            source.loop = false;
            source.play();
            // 根据音频时长回收音效源
            TimerManager.Instance.scheduleOnce(() => {
                this.returnAvailableEffectSource(source);
            }, source.duration);
        }
    }

    // 获取可用音效源
    private getAvailableEffectSource(): AudioSource {
        return this._pool.get();
    }

    // 返回可用音效源
    private returnAvailableEffectSource(source: AudioSource) {
        this._pool.return(source);
    }

    // 设置音乐开关
    setMusicEnabled(enabled: boolean) {
        this._musicOn = enabled;
        this._musicSource.volume = enabled ? this._musicVolume : 0;
        this.saveSettings();
    }

    // 设置音效开关
    setEffectEnabled(enabled: boolean) {
        this._effectOn = enabled;
        this.saveSettings();
    }

    // 渐变音量
    fadeMusicVolume(target: number, duration: number = 1) {
        tween(this._musicSource)
            .to(duration, { volume: target })
            .start();
    }

    // 设置音乐音量（0~1）
    setMusicVolume(v: number) {
        this._musicVolume = Math.min(1, Math.max(0, v));
        if (this._musicOn) this._musicSource.volume = this._musicVolume;
        this.saveSettings();
    }

    // 设置音效音量（0~1）
    setEffectVolume(v: number) {
        this._effectVolume = Math.min(1, Math.max(0, v));
        this.saveSettings();
    }
    
    // 保存设置
    private saveSettings() {
        StorageUtil.set('audioSettings', JSON.stringify({
            musicOn: this._musicOn,
            effectOn: this._effectOn,
            musicVolume: this._musicVolume,
            effectVolume: this._effectVolume
        }));
    }

    // 加载设置
    private loadSettings() {
        const settings = StorageUtil.get('audioSettings');
        if (settings) {
            const { musicOn, effectOn, musicVolume, effectVolume } = JSON.parse(settings);
            this._musicOn = musicOn;
            this._effectOn = effectOn;
            this._musicVolume = musicVolume;
            this._effectVolume = effectVolume;
        }
    }
}


