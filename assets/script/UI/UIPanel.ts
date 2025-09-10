import { _decorator, Node } from 'cc';
import { UIView } from './UIView';
import { IPanelStack } from './UIPanelStack/IPanelStack';

const { ccclass } = _decorator;

@ccclass('UIPanel')
export class UIPanel extends UIView {
    protected _stack: IPanelStack = null;

    public setPanelStack(stack: IPanelStack) {
        this._stack = stack;
    }

    public get stack(): IPanelStack { return this._stack; }

    public show() {
        this.active = true;
        this.onShow();
    }

    public hide() {
        this.active = false;
        this.onHide();
    }

    protected onShow() {
        // 子类可覆写
    }

    protected onHide() {
        // 子类可覆写
    }
}
