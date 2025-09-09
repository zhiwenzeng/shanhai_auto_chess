import { _decorator } from "cc";
import { Ability } from "./Ability";
import { AttributeSet } from "./AttributeSet";
import { Buff } from "./Buff";
import { ETag } from "./ETag";
import { TagContainer } from "./TagContainer";
import { AComponent } from "../AComponent";

const { ccclass, property } = _decorator;

@ccclass('GASComponent')
export class GASComponent extends AComponent {
    public attributeSet = new AttributeSet();

    private _abilities: Map<ETag, Ability> = new Map();
    private _tagContainer = new TagContainer();

    private _usedAbilities: Ability[] = [];
    private _needUpdateBuffs: Buff[] = [];

    update(dt: number): void {
        let needAbilityFilter = false;
        for (let usedAbility of this._usedAbilities) {
            if (usedAbility.isFinished) {
                this._tagContainer.delete(usedAbility.tag);
                needAbilityFilter = true;
            }
        }
        if (needAbilityFilter) {
            this._usedAbilities = this._usedAbilities.filter(a => !a.isFinished);
        }
        for (let usedAbility of this._usedAbilities) {
            usedAbility.update(dt);
        }
        
        let needBuffFilter = false;
        for (let needUpdateBuff of this._needUpdateBuffs) {
            if (needUpdateBuff.isFinished()) {
                this._tagContainer.delete(needUpdateBuff.tag);
                needBuffFilter = true;
            }
        }
        if (needBuffFilter) {
            this._needUpdateBuffs = this._needUpdateBuffs.filter(e => !e.isFinished());
        }
        for (let needUpdateBuff of this._needUpdateBuffs) {
            needUpdateBuff.update(dt);
        }
    }

    addAbility(ability: Ability): void {
        ability.gas = this;
        ability.setOwner(this.getOwner());
        this._abilities.set(ability.tag, ability);
    }

    getAbility<T extends Ability>(tag: ETag): T {
        return this._abilities.get(tag) as T;
    }
    
    deleteAbility(ability: Ability): void {
        this.cancelAbility(ability.tag);
        this._abilities.delete(ability.tag);
    }

    canUseAbility(tag: ETag, target: GASComponent): boolean {
        let ability = this._abilities.get(tag);
        if (!ability || !ability.canUse(this.attributeSet, this._tagContainer, target)) {
            return false;
        }
        return true;
    }

    tryUseAbility(tag: ETag, target: GASComponent): boolean {
        if (!this.canUseAbility(tag, target)) {
            return false;
        }
        let ability = this._abilities.get(tag);
        for (let usedAbility of this._usedAbilities) {
            if (ability.cancelTagContainer.has(usedAbility.tag)) {
                usedAbility.cancel();
            }
        }
        this._tagContainer.add(ability.tag);
        ability.applyCosts(this.attributeSet);
        ability.use(target);
        this._usedAbilities.push(ability);
        return true;
    }

    cancelAbility(tag: ETag): void {
        let usedAbility = this._usedAbilities.find(a => a.tag === tag);
        if (usedAbility) {
            usedAbility.cancel();
        }
    }

    applyBuff(source: GASComponent, buff: Buff): boolean {
        for (let needUpdateBuff of this._needUpdateBuffs) {
            if (buff.cancelTagContainer.has(needUpdateBuff.tag)) {
                needUpdateBuff.deactivate();
            }
        }
        if (buff.canActivate(this._tagContainer)) {
            this._tagContainer.add(buff.tag);
            buff.executions.forEach(execute => execute?.(source, this));
            buff.activate(this.attributeSet, this._tagContainer);
            if (buff.needUpdate()) {
                this._needUpdateBuffs.push(buff);
            }
            return true;
        }
        return false;
    }

    unApplyBuff(buff: Buff): void {
        let findBuff = this._needUpdateBuffs.find(e => e === buff);
        if (findBuff) {
            findBuff.deactivate();
        }
    }
}
