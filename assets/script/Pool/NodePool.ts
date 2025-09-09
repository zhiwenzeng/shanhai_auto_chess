import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import { TClass } from '../Common/Define';
import { IPool, isIPool } from './IPool';

const { ccclass, property } = _decorator;

export class NodePool<T extends Component> {
    private _cls: TClass<T>;
    private _template: Prefab;
    private _factory: () => Node;
    private _queue: Node[] = [];
    get size(): number {
        return this._queue.length;
    }
    constructor(cls: TClass<T>, template: Prefab, size: number) {
        this._cls = cls;
        this._template = template;
        this._factory = () => {
            return instantiate(this._template);
        }
        for (let i = 0; i < size; i++) {
            this._queue.push(this._factory());
        }
    }
    get(): T {
        let node: Node = null;
        if (this._queue.length > 0) {
            node = this._queue.pop();
        }
        else {
            node = this._factory();
        }
        let obj = node.getComponent(this._cls);
        if (isIPool(obj)) {
            obj.onGet();
        }
        return obj;
    }
    return(obj: T) {
        this._queue.push(obj.node);
        if (isIPool(obj)) {
            obj.onReturn();
        }
    }
}


