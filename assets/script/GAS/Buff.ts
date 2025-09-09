import { _decorator } from "cc";
import { AttributeSet } from "./AttributeSet";
import { ETag } from "./ETag";
import { Execution } from "./Execution";
import { Modifier } from "./Modifier";
import { TagContainer } from "./TagContainer";

const { ccclass, property } = _decorator;

export class Buff {
    public tag: ETag = ETag.Unknown;
    public modifiers: Modifier[] = [];//修改器
    public requiredTagContainer: TagContainer = new TagContainer();// 需求标签
    public blockedTagContainer: TagContainer = new TagContainer();// 互斥标签
    public cancelTagContainer: TagContainer = new TagContainer();// 取消标签
    public executions: Execution[] = [];//计算器

    protected _attributeSet: AttributeSet = null;//属性集

    canActivate(tagContainer: TagContainer): boolean {
        if (!this.isFinished()) {
            return false;
        }
        if (this.blockedTagContainer && tagContainer.hasAny(this.blockedTagContainer)) {
            return false;
        }
        if (this.requiredTagContainer && !tagContainer.hasAll(this.requiredTagContainer)) {
            return false;
        }
        return true;
    }
    activate(attributeSet: AttributeSet, tagContainer: TagContainer): void {
        this._attributeSet = attributeSet;
    }
    update(dt: number) {
        
    }
    deactivate(): void {
        this._attributeSet = null;
    }
    needUpdate(): boolean {
        return false;
    }
    isFinished(): boolean {
        return true;
    }
}