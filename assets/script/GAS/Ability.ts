import { _decorator } from 'cc';
import { TimerManager } from '../Manager/TimerManager';
import { AttributeSet } from './AttributeSet';
import { EAttribute } from './EAttribute';
import { ETag } from './ETag';
import { Modifier, EModifierOperation } from './Modifier';
import { TagContainer } from './TagContainer';

const { ccclass, property } = _decorator;

// 消耗
export class Cost {
    public attribute: EAttribute;
    public value: number;
}

export class Ability {
    public costs: Cost[] = [];
    public coolDown: number = 0;
    public tag: ETag = ETag.Unknown;
    public requiredTagContainer: TagContainer = new TagContainer();// 需求标签
    public blockedTagContainer: TagContainer = new TagContainer();// 互斥标签
    public cancelTagContainer: TagContainer = new TagContainer();// 取消标签

    protected _useTime: number = -10e9;
    protected _isFinished: boolean = true;

    private _gas: any;
    public set gas(owner: any) {
        this._gas = owner;
    }
    public get gas(): any {
        return this._gas;
    }

    private _owner: any;
    public setOwner(owner: any) {
        this._owner = owner;
    }
    public getOwner<T>(): T {
        return this._owner as T;
    }

    public get isFinished(): boolean {
        return this._isFinished;
    }

    canUse(attributeSet: AttributeSet, tagContainer: TagContainer, target: any): boolean {
        if (!this._isFinished) {
            return false;
        }
        if (TimerManager.time - this._useTime < this.coolDown) {
            return false;
        }
        if (this.blockedTagContainer && tagContainer.hasAny(this.blockedTagContainer)) {
            return false;
        }
        if (this.requiredTagContainer && !tagContainer.hasAll(this.requiredTagContainer)) {
            return false;
        }
        for (let cost of this.costs) {
            if (attributeSet.getBase(cost.attribute) < cost.value) {
                return false;
            }
        }
        return true;
    }

    applyCosts(attributeSet: AttributeSet): void {
        for (let cost of this.costs) {
            attributeSet.applyBaseModifier(new Modifier(cost.attribute, EModifierOperation.Add, -cost.value));
        }
    }

    update(dt: number): void {

    }

    use(targetGas: any): void {
        this._isFinished = false;
        this._useTime = TimerManager.time;
        this.onUse(targetGas);
    }

    cancel(): void {
        if (this.isFinished) {
            return;
        }
        this.onCancel();
        this.finish();
    }

    finish(): void {
        this.onFinished();
        this._isFinished = true;
    }

    protected onUse(target: any): void {
        
    }

    protected onCancel(): void {

    }

    protected onFinished(): void {
        
    }
}


