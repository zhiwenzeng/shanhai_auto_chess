import { _decorator, Component, Node } from 'cc';
import { UIView } from './UIView';
const { ccclass, property } = _decorator;

@ccclass('UIWindow')
export class UIWindow extends UIView {
    public open() {
        this.onOpen();
        this.show();
    }

    public show() {
        this.active = true;
        this.onShow();
    }

    public hide() {
        this.active = false;
        this.onHide();
    }

    public close() {
        this.hide();
        this.onClose();
    }

    protected onOpen() {

    }

    protected onShow() {
        
    }

    protected onHide() {
        
    }

    protected onClose() {
        
    }
}


