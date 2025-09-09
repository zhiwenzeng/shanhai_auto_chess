import { __private, _decorator, Component, director, Node, Scene } from 'cc';
import { TClass } from './Common/Define';

const { ccclass, property } = _decorator;

/**
 * 单例模式
 * public static get Instance(): GameApp {
 *     return this.getInstance(GameApp);
 * }
 */
@ccclass('ASingleton')
export class ASingleton extends Component {
    private static _instance: ASingleton = null;

    private _isInitialized: boolean = false;

    protected static getInstance<T extends ASingleton>(cls: TClass<T>): T {
        // 判定是否存在
        if (this._instance == null) {
            // 从场景中取
            this._instance = director.getScene().getComponentInChildren(cls);
            // 取不到就创建Node并且addComponent
            if (this._instance == null) {
                let instanceNode = new Node(cls.name);
                this._instance = instanceNode.addComponent(cls);
            }
            // 添加到Scene并且持久化
            director.getScene().addChild(this._instance.node);
            director.addPersistRootNode(this._instance.node);
            // 初始化
            this._instance.initialize();
        }
        return this._instance as T;
    }
    
    public initialize(): void {
        if (this._isInitialized) {
            return;
        }
        this._isInitialized = true;
        this.onInitialize();
    }

    public uninitialize(): void {
        if (!this._isInitialized) {
            return;
        }
        this._isInitialized = false;
        this.onUnInitialize();
    }

    protected onInitialize() {
        
    }

    protected onUnInitialize() {
        
    }
}


