import { _decorator, Canvas, Component, error, instantiate, Node, Prefab, UITransform, v3, warn } from 'cc';
import { ASingleton } from '../ASingleton';
import { EEventType, EUILayer, EUIWindow } from '../Common/Enums';
import { Const, IUIConfig } from '../Common/Define';
import { UILoadingWindow } from '../UI/UILoadingWindow';
import { UIWindow } from '../UI/UIWindow';
import { ResourceManager } from './ResourceManager';
import { EventManager } from './EventManager';
import { SuperCanvas } from '../SuperCanvas';
import { UILayer } from '../UI/UILayer';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends ASingleton {
    public static get Instance(): UIManager {
        return this.getInstance(UIManager);
    }

    public static Canvas: SuperCanvas;

    private _isReady: boolean = false;
    private _readyCallback: Function;

    private _layers: Map<EUILayer, UILayer> = new Map();
    private _windows: Map<EUIWindow, UIWindow> = new Map();

    protected onInitialize(): void {
        Object.keys(EUILayer).forEach(layerKey => {
            let layer: UILayer = new Node(layerKey).addComponent(UILayer);
            layer.transform.setContentSize(UIManager.Canvas.transform.contentSize);
            UIManager.Canvas.addChild(layer);
            layer.position = v3(0, 0, 0);
            this._layers.set(EUILayer[layerKey], layer);
        });
        let showLoadingCallback = (() => {
            this.show(EUIWindow.Loading);
        }).bind(this);
        EventManager.Instance.on(EEventType.ShowLoading, showLoadingCallback);
        let hideLoadingCallback = (() => {
            this.hide(EUIWindow.Loading);
        });
        EventManager.Instance.on(EEventType.HideLoading, hideLoadingCallback);
        this._isReady = true;
        this._readyCallback?.();
    }

    public getLayer(layer: EUILayer): UILayer {
        return this._layers.get(layer);
    }

    public showOnly(type: EUIWindow): void {
        this.show(type, true);
    }

    public show(type: EUIWindow, needHideAll: boolean = false): void {
        if (!this._isReady) {
            this._readyCallback = () => {
                this.show(type, needHideAll);
            }
            return;
        }
        if (needHideAll) {
            this.hideAll();
        }
        let config = Const.UIConfigs[type];
        if (!config) {
            error(`type为${type}的关卡配置不存在`);
            return;
        }
        let layerNode = this.getLayer(config.layer);
        if (this._windows.has(type)) {
            let uiWindow = this._windows.get(type);
            uiWindow.setSiblingIndex(layerNode.children.length - 1);
            uiWindow.show();
            return;
        }
        ResourceManager.Instance.loadAsync<Prefab>(config.path).then((prefab: Prefab) => {
            let uiWindow = instantiate(prefab).getComponent(UIWindow);
            layerNode.addChild(uiWindow);
            this._windows.set(type, uiWindow);
            this._windows.get(type).open();
        }).catch(err => {
            error(err);
        });
    }

    public hide(type: EUIWindow): void {
        if (!this._isReady) {
            error("UI管理器还未初始化完成");
            return;
        }
        if (!this._windows.has(type)) {
            return;
        }
        this._windows.get(type).hide();
    }

    public hideAll(): void {
        if (!this._isReady) {
            warn("UI管理器还未初始化, 建议不要调用");
            return;
        }
        this._windows.forEach((uiWindow: UIWindow) => {
            uiWindow.hide();
        });
    }
}