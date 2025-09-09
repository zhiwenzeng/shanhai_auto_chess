import { _decorator, Component, Node } from 'cc';
import { ASingleton } from '../ASingleton';
import { MultiCallback } from '../Common/Structs';
import { TFunction } from '../Common/Define';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager extends ASingleton {
    public static get Instance(): EventManager {
        return this.getInstance(EventManager);
    }
    
    // 事件Map
    private _events: Map<string, MultiCallback> = new Map();
    
    /**
     * 注册事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    public on(event: string, callback: TFunction) {
        if (!this._events.has(event)) {
            this._events.set(event, new MultiCallback());
        }
        const multiCallback = this._events.get(event);
        multiCallback.on(callback);
    }

    /**
     * 移除事件监听
     * @param event 事件名称
     * @param callback 回调函数
     */
    public off(event: string, callback: TFunction) {
        if (this._events.has(event)) {
            const multiCallback = this._events.get(event);
            multiCallback.off(callback);
            if (multiCallback.isEmpty()) {
                this._events.delete(event);
            }
        }
    }

    /**
     * 触发事件
     * @param event 事件名称
     * @param args 事件参数
     */
    public emit(event: string, ...args: any) {
        if (this._events.has(event)) {
            const multiCallback = this._events.get(event);
            multiCallback.emit(...args);
        }
    }

    /**
     * 清除所有事件监听
     */
    public clear() {
        this._events.clear();
    }
}