import { Enum } from "cc";

export enum ECollider {
    Default = 1 << 0,
}
Enum(ECollider);

export enum EEventType {
    // Loading
    // 显示加载界面
    ShowLoading = "ShowLoading",
    // 设置加载进度
    SetLoadingProgress = "SetLoadingProgress",
    // 隐藏加载界面
    HideLoading = "HideLoading",
}

export enum EUILayer {
    /* 窗口层 */
    Windows = "Windows",
    /** 加载层 */
    Loading = "Loading",
    /** 主页层 */
    Home = "Home",
    /** 战斗层（HUD等） */
    BattleHUD = "Battle",
    /** 设置层（全局可见） */
    Setting = "Setting",
}
Enum(EUILayer);

export enum EUIWindow {
    /** 加载界面 */
    Loading = 1,
    /** 主页（含多级面板） */
    Home = 2,
    /** 战斗HUD */
    BattleHUD = 3,
    /** 设置 */
    Setting = 4,
}
Enum(EUIWindow);

export enum EFaction {
    None,
    Ally,
    Enemy,
}
Enum(EFaction);
