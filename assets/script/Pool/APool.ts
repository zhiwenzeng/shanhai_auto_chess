import { IPool, isIPool } from "./IPool";

export class APool<T> {
    private _factory: () => T;
    private _queue: T[] = [];
    get size(): number {
        return this._queue.length;
    }
    constructor(size: number, factory: () => T) {
        this._factory = factory;
        for (let i = 0; i < size; i++) {
            this._queue.push(this._factory());
        }
    }
    get(): T {
        let instance: T = null;
        if (this._queue.length > 0) {
            instance = this._queue.pop();
        }
        else {
            instance = this._factory();
        }
        if (isIPool(instance)) {
            instance.onGet();
        }
        return instance;
    }
    return(obj: T): void {
        this._queue.push(obj);
        if (isIPool(obj)) {
            obj.onReturn();
        }
    }
}


