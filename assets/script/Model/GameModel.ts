import { Const } from "../Common/Define";

/**
 * 游戏数据
 */
export class GameModel {
    // 存档关键数据（仅在每回合战斗结束后保存）
    public turn: number = 1;                 // 当前回合（从1开始）
    public life: number = 10;                // 当前生命（不走 Rule，可按策划调整初始值）
    public winCount: number = 0;             // 已获胜局数（胜利达10判定通关）

    // 阵容（上阵5格，按前→后）
    public board: (UnitData | null)[] = new Array(Const.Rule.BoardSlots).fill(null);

    // 商店：只记录商店条目在 Shop 表中的 id 列表（动物与食物/装备分开）
    public shopAnimalIds: number[] = new Array(Const.Rule.ShopAnimalSlots).fill(0);
    public shopFoodIds: number[] = new Array(Const.Rule.ShopFoodSlots).fill(0);

    constructor() { }
}

// 上阵单位数据（运行时可被数值修改）
export interface UnitData {
    uid: string;            // 运行时唯一ID（用于换位/引用）
    cfgId: number;          // 对应 AnimalCfg.animalId
    baseAtk: number;        // 初始攻（来自表）
    baseHp: number;         // 初始血（来自表）
    atk: number;            // 当前攻击
    hp: number;             // 当前生命
    abilityIds: number[];   // 技能ID列表：含基础技能、装备/食物附加技能等
    tags: string[];         // 标签（用于筛选/展示）
    equipmentId?: number;   // 装备（0/undefined 表示无）
}
