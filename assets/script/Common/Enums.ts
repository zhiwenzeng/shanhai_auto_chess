import { Enum } from "cc";

export enum ECollider {
    Default = 1 << 0,
    Obstacle = 1 << 1,
    Ball = 1 << 2,
    Column = 1 << 3,
    Character = 1 << 4,
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
}
Enum(EUILayer);

export enum EUIWindow {
    /** 加载界面 */
    Loading = 1,
}
Enum(EUIWindow);

export enum EFaction {
    None,
    Ally,
    Enemy,
}
Enum(EFaction);