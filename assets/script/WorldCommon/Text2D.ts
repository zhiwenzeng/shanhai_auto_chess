import { _decorator, Component, Label, Node, v3, Vec3 } from 'cc';
import { AComponent } from '../AComponent';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('Text2D')
@requireComponent(Label)
export class Text2D extends AComponent {
    private _inner: Label;
    public get inner(): Label {
        if (!this._inner) {
            this._inner = this.getComponent(Label);
        }
        return this._inner;
    }
    public set forward(value: number) {
        let scale = v3(this.scale);
        scale.x = Math.abs(scale.x) * value;
        this.scale = scale;
    }
    public set text(value: string) {
        this.inner.string = value;
    }
}

