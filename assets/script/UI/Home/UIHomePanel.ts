import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UIButton } from '../Common/UIButton';
import { UIManager } from '../../Manager/UIManager';
import { EUIWindow } from '../../Common/Enums';
import { UIPlayModePanel } from './UIPlayModePanel';
import { UIGalleryPanel } from './UIGalleryPanel';

const { ccclass, property } = _decorator;

@ccclass('UIHomePanel')
/**
 * 一级面板：主页按钮区
 * - 三个主按钮：游玩、卡包、设置。
 * - 切换到二/三级面板时自动被 Stack 隐藏；返回时再显示。
 */
export class UIHomePanel extends UIPanel {
    @property(UIButton) btnPlay: UIButton = null;
    @property(UIButton) btnCardPack: UIButton = null;
    @property(UIButton) btnSetting: UIButton = null;

    protected onShow(): void {
        if (this.btnPlay) this.btnPlay.onClick = this.onClickPlay.bind(this);
        if (this.btnCardPack) this.btnCardPack.onClick = this.onClickCardPack.bind(this);
        if (this.btnSetting) this.btnSetting.onClick = this.onClickSetting.bind(this);
    }

    private onClickPlay() {
        this.stack?.showByType(UIPlayModePanel);
    }

    private onClickCardPack() {
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openReadOnly(1, '图鉴 - 卡包');
        this.stack?.showByType(UIGalleryPanel);
    }

    private onClickSetting() {
        UIManager.Instance.show(EUIWindow.Setting);
    }
}
