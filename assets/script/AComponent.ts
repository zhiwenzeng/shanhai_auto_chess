import { __private, _decorator, Component, find, math, Node, UITransform } from 'cc';
import { TClass } from './Common/Define';
import { ResourceManager } from './Manager/ResourceManager';

const { ccclass, property, requireComponent } = _decorator;

@ccclass('AComponent')
@requireComponent(UITransform)
export class AComponent extends Component {

    protected _owner: any;

    protected _isDestroy: boolean = false;

    protected _urlCountCaches: Map<string, number> = new Map();

    protected _transform: UITransform = null;

    public getOwner<T>(): T {
        return this._owner as T;
    }

    public setOwner(value: any) {
        this._owner = value;
    }

    public get isDestroy(): boolean {
        return this._isDestroy;
    }

    public get active(): boolean {
        return this.node.active;
    }

    public set active(value: boolean) {
        this.node.active = value;
    }

    public get position(): Readonly<math.Vec3> {
        return this.node.position;
    }

    public set position(value: Readonly<math.Vec3>) {
        this.node.position = value;
    }

    public get worldPosition(): Readonly<math.Vec3> {
        return this.node.worldPosition;
    }

    public set worldPosition(value: Readonly<math.Vec3>) {
        this.node.worldPosition = value;
    }

    public get scale(): Readonly<math.Vec3> {
        return this.node.scale;
    }

    public set scale(value: Readonly<math.Vec3>) {
        this.node.scale = value;
    }

    public get transform(): UITransform {
        if (this._transform == null) {
            this._transform = this.getComponent(UITransform);
        }
        return this._transform;
    }

    public get children(): Node[] {
        return this.node.children;
    }

    protected onDestroy(): void {
        this.releaseUrlCache();
        this.onRelease();
        this._isDestroy = true;
    }

    protected onRelease(): void {

    }

    public addChild(value: AComponent) {
        let worldPosition = value.worldPosition;
        this.node.addChild(value.node);
        value.worldPosition = worldPosition;
    }

    public kill() {
        if (this.isDestroy) {
            return;
        }
        this.node.destroy();
    }

    public addUrlCache(path: string) {
        let count = this._urlCountCaches.get(path);
        if (count == null) {
            count = 0;
        }
        this._urlCountCaches.set(path, count + 1);
    }

    public delUrlCache(path: string) {
        let count = this._urlCountCaches.get(path);
        if (count == null) {
            count = 0;
        }
        this._urlCountCaches.set(path, count - 1);
    }

    public releaseUrlCache() {
        for (let [path, count] of this._urlCountCaches) {
            while (count > 0) {
                ResourceManager.Instance.release(path);
                count -= 1;
            }
        }
    }

    public setSiblingIndex(index: number) {
        this.node.setSiblingIndex(index);
    }

    public get siblingIndex(): number {
        return this.node.getSiblingIndex();
    }

    public findComponentByPath<T extends Component>(cls: TClass<T>, path: string, target?: Node): T {
        return this.findNodeByPath(path, target)?.getComponent(cls);
    }

    public findNodeByPath(path: string, target?: Node): Node {
        if (target == null) {
            target = this.node;
        }
        return find(path, target);
    }

    public findComponentByNodeName<T extends Component>(cls: TClass<T>, nodeName: string): T {
        return this.__findNodeByName(nodeName, this.node)?.getComponent(cls);
    }

    public findNodeByName(nodeName: string): Node {
        return this.__findNodeByName(nodeName, this.node);
    }

    private __findNodeByName(nodeName: string, node: Node): Node {
        if (node.name == nodeName) {
            return node;
        }
        for (let children of node.children) {
            let slot = this.__findNodeByName(nodeName, children);
            if (slot != null) {
                return slot;
            }
        }
        return null;
    }
}


