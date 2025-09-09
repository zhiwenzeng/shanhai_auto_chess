import { _decorator, Component, Node } from 'cc';
import { ASingleton } from '../ASingleton';
const { ccclass, property } = _decorator;

@ccclass('CameraManager')
export class CameraManager extends ASingleton {
    public static get Instance(): CameraManager {
        return this.getInstance(CameraManager);
    }
}