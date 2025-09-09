import { TFunction } from "./Define";
export class MultiCallback {
    private _callbacks: TFunction[] = [];
    public on(callback: TFunction) {
        let findIndex = this._callbacks.findIndex((cb) => cb == callback);
        if (findIndex == -1) {
            this._callbacks.push(callback);
        }
    }
    public off(callback: TFunction) {
        let findIndex = this._callbacks.findIndex((cb) => cb == callback);
        if (findIndex != -1) {
            this._callbacks.splice(findIndex, 1);
        }
    }
    public emit(...args: any) {
        for (let callback of this._callbacks) {
            callback(...args);
        }
    }
    public isEmpty(): boolean {
        return this._callbacks.length === 0;
    }
}

export class NotifyField<T> {
    public value: T;
    private _multiCallback: MultiCallback;
    constructor(v: T) {
        this.value = v;
        this._multiCallback = new MultiCallback();
    }
    public on(callback: (newValue: T) => void) {
        this._multiCallback.on(callback);
    }
    public off(callback: (newValue: T) => void) {
        this._multiCallback.off(callback);
    }
    public setValue(newValue: T, isNotify: boolean = false) {
        this.value = newValue;
        if (isNotify) {
            this._multiCallback.emit(newValue);
        }
    }
}
