import { Enum } from "cc";

export enum ETag {
    /** 未知 */
    Unknown = 0,

    /** 卡比万能拳 */
    KirbyUniversalFistEat, // 吃
    KirbyUniversalFistFire, // 吐
    KirbyUniversalFistSword, // 剑
    KirbyUniversalFistStone, // 石头
    KirbyUniversalFistSlide, // 滑铲
    KirbyUniversalFistRotateSword, // 旋转剑
    KirbyUniversalFistRotateHammer, // 旋转锤子
    KirbyUniversalFistPunching, // 万能拳

    /** 小怪-格斗家 */
    SmallFighterForwardA,
    SmallFighterForwardB,
}
Enum(ETag);