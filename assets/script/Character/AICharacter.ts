import { _decorator, CCFloat, Component, Label, Node, tween, v2, v3, Vec3 } from 'cc';
import { AICharacterMovement } from './AICharacterMovement';
import { AComponent } from '../AComponent';
import { TeamComponent } from './TeamComponent';
import { ICharacterConfig, NONE, TFunction } from '../Common/Define';
import { EFaction } from '../Common/Enums';
import { AIComponent } from './AIComponent';
import { GASComponent } from '../GAS/GASComponent';
import { MultiCallback } from '../Common/Structs';
import { Buff } from '../GAS/Buff';
import { ETag } from '../GAS/ETag';
import { EModifierOperation, Modifier } from '../GAS/Modifier';
import { EAttribute } from '../GAS/EAttribute';
import { StateMachine } from '../FSM/StateMachine';
import { AnimationComponent } from './AnimationComponent';
import { TimerManager } from '../Manager/TimerManager';
import { HitComponent } from './HitComponent';
import { Text2D } from '../WorldCommon/Text2D';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('AICharacter')
@requireComponent(AnimationComponent)
@requireComponent(AICharacterMovement)
@requireComponent(AIComponent)
@requireComponent(GASComponent)
@requireComponent(TeamComponent)
@requireComponent(HitComponent)
export class AICharacter extends AComponent {
    @property(CCFloat)
    public defaultHealth: number = 3;
    @property(CCFloat)
    public defaultAttack: number = 1;
    @property(CCFloat)
    public defaultCoolDownScale: number = 1;

    public isInvincible: boolean = false;

    private _animation: AnimationComponent = null;
    private _fsm: StateMachine = null;
    private _movement: AICharacterMovement = null;
    private _ai: AIComponent = null;
    private _gas: GASComponent = null;
    private _team: TeamComponent = null;
    private _hit: HitComponent = null;

    private _HP: Text2D = null;

    public get healthCurrent(): number {
        return this.gas.attributeSet.getCurrent(EAttribute.Health);
    }

    private _isHurtTimer: number = NONE;

    protected _isHurt: boolean = false;
    public get isHurt(): boolean {
        return this._isHurt;
    }

    protected _isDeath: boolean = false;
    public get isDeath(): boolean {
        return this._isDeath;
    }

    public get animation(): AnimationComponent {
        return this._animation;
    }

    public get fsm(): StateMachine {
        return this._fsm;
    }

    protected set fsm(fsm: StateMachine) {
        this._fsm = fsm;
    }

    public get movement(): AICharacterMovement {
        return this._movement;
    }

    public get ai(): AIComponent {
        return this._ai;
    }

    public get gas(): GASComponent {
        return this._gas;
    }

    public get team(): TeamComponent {
        return this._team;
    }

    public _config: ICharacterConfig;

    public set config(config: ICharacterConfig) {
        this._config = config;
    }

    public get teamType(): EFaction {
        return this._team.faction;
    }

    public set teamType(type: EFaction) {
        this._team.faction = type;
    }

    protected setup(): void {

    }

    protected setupFsm(): void {

    }

    protected setupAttributes(): void {
        let health = this.gas.attributeSet.define(EAttribute.Health, this.defaultHealth);
        this.gas.attributeSet.define(EAttribute.MaxHealth, this.defaultHealth);
        this.gas.attributeSet.define(EAttribute.Attack, this.defaultAttack);
        this.gas.attributeSet.define(EAttribute.CoolDownScale, this.defaultCoolDownScale);
        health.onPostCurrentChange = (oldCurrent: number, newCurrent: number) => {
            this._isHurt = true;
            let hitDuration = 0.6;
            TimerManager.Instance.unschedule(this._isHurtTimer);
            this._isHurtTimer = NONE;
            this._isHurtTimer = TimerManager.Instance.scheduleOnce(() => {
                this._isHurt = false;
                if (this.isDeath && !this.isDestroy) {
                    this.kill();
                }
            }, hitDuration);
            this._hit.playHitEffect(this.movement.worldAABB.height / 2, hitDuration, 6);
            console.log(`${this.name} health change from ${oldCurrent} to ${newCurrent}`);
            this._HP.text = `${newCurrent}`;
            if (this._isDeath) {
                this._HP.active = false;
                return;
            }
            if (this.healthCurrent <= 0) {
                this._isDeath = true;
            }
        };
        this._HP.text = `${health.current}`;
    }

    protected setupAbilities(): void {
        
    }

    protected setupAi(): void {

    }

    protected onLoad(): void {
        this._animation = this.getComponent(AnimationComponent);
        this._animation.setOwner(this);
        this._movement = this.getComponent(AICharacterMovement);
        this._movement.setOwner(this);
        this._ai = this.getComponent(AIComponent);
        this._ai.setOwner(this);
        this._gas = this.getComponent(GASComponent);
        this._gas.setOwner(this);
        this._team = this.getComponent(TeamComponent);
        this._team.setOwner(this);
        this._hit = this.getComponent(HitComponent);
        this._hit.setOwner(this);
        this._HP = this.findComponentByPath(Text2D, "HP");
    }

    protected start(): void {
        this.setup();
        this.setupFsm();
        this.setupAttributes();
        this.setupAbilities();
        this.setupAi();
    }

    protected update(dt: number): void {
        this.fsm?.update(dt);
        let scale = v3(this._HP.scale);
        scale.x = Math.abs(scale.x) * this.movement.forward;
        this._HP.scale = scale;
    }

    private _acquireDamageBuff(damage: number): Buff {
        let buff = new Buff();
        buff.tag = ETag.Unknown;
        buff.executions.push((source: GASComponent, target: GASComponent) => {
            if (this.isInvincible) {
                return;
            }
            target.attributeSet.applyBaseModifier(new Modifier(EAttribute.Health, EModifierOperation.Add, -damage));
        });
        return buff;
    }

    // public knockUp(directionX: number, isForce: boolean = false, callback?: TFunction): void {
    //     if (!this.isHurt && !isForce) {
    //         return;
    //     }
    //     directionX = directionX >= 0 ? 1 : -1;
    //     this.disableAction();
    //     this.movement.linearVelocity = v2(directionX * 3, 5.4);
    //     this.movement.setForward(-directionX, true);
    //     TimerManager.Instance.scheduleOnce(() => {
    //         if (this.isDestroy) {
    //             callback?.();
    //             return;
    //         }
    //         this.enableAction();
    //         this.movement.linearVelocity = v2(0, this.movement.linearVelocity.y);
    //         callback?.();
    //     }, 1.2);
    // }

    public enableAction(): void {
        // console.log(`${this.name} enable action.`);
        this.ai.enable = true;
        this.movement.enable = true;
    }

    public disableAction(): void {
        // console.log(`${this.name} disable action.`);
        this.ai.enable = false;
        this.movement.enable = false;
    }

    public takeDamage(damage: number, cause: GASComponent): void {
        this.gas.applyBuff(cause, this._acquireDamageBuff(damage));
    }

    public kill(): void {
        this.disableAction();
        super.kill();
    }
}


