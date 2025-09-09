import { Attribute } from "./Attribute";
import { EAttribute } from "./EAttribute";
import { Modifier, EModifierOperation } from "./Modifier";

export class AttributeSet {
    private _attributes = new Map<EAttribute, Attribute>();
    private _currentModifiers = new Set<Modifier>();
    // 定义新属性
    define(attribute: EAttribute, defaultValue: number): Attribute {
        let attr = new Attribute(defaultValue, defaultValue);
        this._attributes.set(attribute, attr);
        return attr;
    }
    // 获取基础值
    getBase(attribute: EAttribute): number {
        return this._attributes.get(attribute).base;
    }
    // 获取当前值（受Modifier影响）
    getCurrent(attribute: EAttribute): number {
        return this._attributes.get(attribute).current;
    }
    // 应用修改器
    applyBaseModifier(mod: Modifier): void {
        let newValue = this.getBase(mod.attribute);
        switch(mod.operation) {
            case EModifierOperation.Add: newValue += mod.value; break;
            case EModifierOperation.Multiply: newValue *= mod.value; break;
            case EModifierOperation.Override: newValue = mod.value; break;
        }
        this._setBase(mod.attribute, newValue);
        this._recalculateCurrent(mod.attribute);
    }
    applyCurrentModifier(mod: Modifier): void {
        this._currentModifiers.add(mod);
        this._recalculateCurrent(mod.attribute);
    }
    // 移除修改器
    unApplyCurrentModifier(mod: Modifier): void {
        if (this._currentModifiers.has(mod)) {
            this._currentModifiers.delete(mod);
            this._recalculateCurrent(mod.attribute);
        }
    }
    // 直接修改基础值
    private _setBase(attribute: EAttribute, newBase: number): void {
        const attr = this._attributes.get(attribute);
        attr.base = newBase;
    }
    // 直接修改当前值
    private _setCurrent(attribute: EAttribute, newCurrent: number): void {
        let attr = this._attributes.get(attribute);
        let oldCurrent = attr.current;
        attr.current = attr.onCheckCurrentChange(oldCurrent, newCurrent);
        attr.onPostCurrentChange(oldCurrent, attr.current);// 触发更新
    }
    // 重新计算当前值
    private _recalculateCurrent(attribute: EAttribute): void {
        let current = this.getBase(attribute);
        Array.from(this._currentModifiers.values())
            .filter(mod => mod.attribute === attribute)
            .forEach(mod => {
                switch(mod.operation) {
                    case EModifierOperation.Add: current += mod.value; break;
                    case EModifierOperation.Multiply: current *= mod.value; break;
                    case EModifierOperation.Override: current = mod.value; break;
                }
            });
        this._setCurrent(attribute, current);
    }
}