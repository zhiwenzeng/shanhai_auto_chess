import { Enum } from "cc";

export enum EAttribute {
    Health,
    Attack,

    // TODO 待删除
    MaxHealth,
    CoolDownScale,
}
Enum(EAttribute);