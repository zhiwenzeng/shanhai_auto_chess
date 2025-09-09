import { _decorator } from "cc";
import { AttributeSet } from "./AttributeSet";
import { Buff } from "./Buff";
import { TagContainer } from "./TagContainer";

const { ccclass, property } = _decorator;

class BuffInstant extends Buff {
    activate(attributeSet: AttributeSet, tags: TagContainer): void {
        super.activate(attributeSet, tags);
        this.modifiers.forEach(mod => attributeSet.applyBaseModifier(mod));
    }
}