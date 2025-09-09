import { _decorator, Canvas, Component, Node } from 'cc';
import { AComponent } from './AComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('SuperCanvas')
@requireComponent(Canvas)
export class SuperCanvas extends AComponent {
    private _inner: Canvas;
    public get inner() {
        if (!this._inner) {
            this._inner = this.getComponent(Canvas);
        }
        return this._inner;
    }
}

