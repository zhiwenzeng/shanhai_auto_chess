import { _decorator } from 'cc';
import { ASingleton } from '../ASingleton';
import { AComponent } from '../AComponent';
import { SuperCanvas } from '../SuperCanvas';

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends ASingleton {
    public static get Instance(): GameManager {
        return this.getInstance(GameManager);
    }
    
    public static Canvas: SuperCanvas;

    public addChild(child: AComponent) {
        GameManager.Canvas.addChild(child);
    }

}