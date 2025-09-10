import { _decorator } from 'cc';
import { AFramework } from './script/AFramework';
import { AComponent } from './script/AComponent';
import { ResourceManager } from './script/Manager/ResourceManager';
import { EEventType,  EUIWindow } from './script/Common/Enums';
import { UIManager } from './script/Manager/UIManager';
import { EventManager } from './script/Manager/EventManager';
import { SuperCanvas } from './script/SuperCanvas';
import { ModelManager } from './script/Manager/ModelManager';

const { ccclass, property } = _decorator;

@ccclass('Launcher')
export class Launcher extends AComponent {
    public GameCanvas: SuperCanvas = null;
    public UICanvas: SuperCanvas = null;
    async onLoad() {
        this.GameCanvas ??= this.findComponentByPath(SuperCanvas, "Game");
        this.UICanvas ??= this.findComponentByPath(SuperCanvas, "UI");
        ModelManager.Load();
        AFramework.Instance.launcher(this.UICanvas, this.GameCanvas);
        EventManager.Instance.emit(EEventType.ShowLoading);
        await ResourceManager.Instance.preload([
            
        ]);
        EventManager.Instance.emit(EEventType.SetLoadingProgress, 1);
        EventManager.Instance.emit(EEventType.HideLoading);
        // 进入Home
        UIManager.Instance.show(EUIWindow.Home);
    }
}
