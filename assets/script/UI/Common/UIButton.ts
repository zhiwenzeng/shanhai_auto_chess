import { _decorator, Button, Component, Node } from 'cc';
import { UIView } from '../UIView';
import { ButtonTransition } from '../../Common/Define';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('UIButton')
@requireComponent(Button)
export class UIButton extends UIView {
    
    private _inner: Button;
    private get inner(): Button {
        if (this._inner == null) {
            this._inner = this.getComponent(Button);
        }
        return this._inner;
    }

    public onClick: Function;

    protected start(): void {
        let onClickHandler = (() => {
            this.onClick?.();
        }).bind(this);
        this.inner.node.on(Button.EventType.CLICK, onClickHandler, this);
    }

    public set transition(newTransition: ButtonTransition) {
        this.inner.transition = newTransition;
    }
}


