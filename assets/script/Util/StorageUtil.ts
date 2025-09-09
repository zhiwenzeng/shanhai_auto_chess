import { _decorator, Component, Node, sys } from 'cc';
const { ccclass, property } = _decorator;

export class StorageUtil {
    public static set(key: string, value: any) {
        sys.localStorage.setItem(key, value);
    }
    public static get(key: string): any {
        return sys.localStorage.getItem(key);
    }
}


