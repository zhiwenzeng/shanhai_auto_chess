import { __private, Component, Enum } from "cc";
import { ECollider, EUILayer, EUIWindow } from "./Enums";

export const NONE = -1;
export type TClass<T> = new (...args: any[]) => T;
export type TFunction = (...any: any[]) => void;

export const ReboundMask = 0xffffffff;

export type ButtonTransition = __private._cocos_ui_button__Transition;

export interface IUIConfig {
    layer: EUILayer;
    path: string;
}

export interface IModeConfig {
    name: string;
    path: string;
    callback: TFunction;
}

export interface IHomeModeConfig {
    name: string;
}

export interface ICharacterConfig {
    id: number;
    previewPath: string;
    templatePath: string;
}

export namespace Const {
    // export const FlyingEffect: string = "prefabs/Effects/Fly";
    // export const HitEffect: string = "prefabs/Effects/Air";
    export const UIConfigs: { [key: number]: IUIConfig } = {
        [EUIWindow.Loading] : { layer: EUILayer.Loading, path: "ui/UILoadingWindow" },
    };
}