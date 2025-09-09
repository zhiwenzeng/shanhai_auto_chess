import { _decorator, Component, instantiate, Node, Prefab, tween, v3, Vec3 } from 'cc';
import { Const } from '../Common/Define';
import { GameManager } from './GameManager';
import { ResourceManager } from './ResourceManager';
import { ASingleton } from '../ASingleton';
import { AComponent } from '../AComponent';
import { Effect } from '../Effect/Effect';
import { NodePool } from '../Pool/NodePool';

const { ccclass, property } = _decorator;

@ccclass('EffectManager')
export class EffectManager extends ASingleton {
    public static get Instance(): EffectManager {
        return this.getInstance(EffectManager);
    }

    private _hitPool: NodePool<Effect>;

    protected onInitialize(): void {
        let hitTemplate = ResourceManager.Instance.load<Prefab>(Const.HitEffect);
        this._hitPool = new NodePool<Effect>(Effect, hitTemplate, 10);
    }

    public playHitEffect(parent: AComponent, follow: AComponent, offset: Vec3) {
        let hit = this._hitPool.get();
        parent.addChild(hit);
        hit.play(follow, offset);
    }

    public playFlyingEffect(parent: AComponent, form: Vec3, to: Vec3, callback?: Function, duration?: number) {
        ResourceManager.Instance.loadAsync<Prefab>(Const.FlyingEffect)
            .then((template: Prefab) => {
                let effect: Effect = instantiate(template).getComponent(Effect);
                parent.addChild(effect);
                effect.worldPosition = v3(form);
                if (!duration) {
                    duration = effect.duration;
                }
                tween(effect).to(duration, {
                    worldPosition: to
                }).call(() => {
                    effect.kill();
                    callback?.();
                }).start();
            });
    }
}

