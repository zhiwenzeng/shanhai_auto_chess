import { _decorator, Canvas, Component, Node } from 'cc';
import { ASingleton } from './ASingleton';
import { UIManager } from './Manager/UIManager';
import { GameManager } from './Manager/GameManager';
import { SuperCanvas } from './SuperCanvas';
const { ccclass, property } = _decorator;

@ccclass('AFramework')
export class AFramework extends ASingleton {
    public static get Instance(): AFramework {
        return this.getInstance(AFramework);
    }

    public launcher(UICanvas: SuperCanvas, GameCanvas: SuperCanvas) {
        UIManager.Canvas = UICanvas;
        GameManager.Canvas = GameCanvas;
        UIManager.Instance.initialize();
        GameManager.Instance.initialize();
    }
}


