import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export interface IPool {
    onGet();
    onReturn();
}

export function isIPool(obj: any): obj is IPool {
    return obj && typeof obj.onGet === 'function' && typeof obj.onReturn === 'function';
}