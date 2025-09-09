import { MultiCallback } from "../Common/Structs";
import { ETag } from "./ETag";

export class TagContainer {
    private _tags: Map<ETag, number> = new Map();
    private _onAddChanges = new MultiCallback();
    private _onDeleteChanges = new MultiCallback();
    constructor(tags: ETag[] = []) {
        for (let t of tags) {
            this.add(t);
        }
    }
    // 添加标签
    add(tag: ETag): TagContainer {
        if (!this.has(tag)) {
            this._tags.set(tag, 1);
            this._onAddChanges.emit(tag);
        }
        else {
            this._tags.set(tag, this._tags.get(tag) + 1);
        }
        return this;
    }
    // 移除标签
    delete(tag: ETag): TagContainer {
        if (this.has(tag)) {
            if (this._tags.get(tag) == 1) {
                this._tags.delete(tag);
                this._onDeleteChanges.emit(tag);
            }
            else {
                this._tags.set(tag, this._tags.get(tag) - 1);
            }
        }
        return this;
    }
    // 精确匹配检查
    has(tag: ETag): boolean {
        return this._tags.has(tag);
    }
    // 包含任意标签
    hasAny(container: TagContainer): boolean {
        let tags = container._tags;
        for (let [tag, _] of tags) {
            if (this._tags.has(tag)) {
                return true;
            }
        }
        return false;
    }
    // 包含所有标签
    hasAll(container: TagContainer): boolean {
        let tags = container._tags;
        for (let [tag, _] of tags) {
            if (!this._tags.has(tag)) {
                return false;
            }
        }
        return true;
    }
}