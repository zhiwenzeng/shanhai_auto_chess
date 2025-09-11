import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UIMatchDeckPanel } from './UIMatchDeckPanel';
import { UIFriendPanel } from './UIFriendPanel';
import { UIButton } from '../Common/UIButton';

const { ccclass, property } = _decorator;

/**
 * 二级面板：游玩模式选择
 * - 按钮：匹配、与好友一起玩。
 * - 功能：进入对应的三级面板（匹配卡包 / 好友加入或建立）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UIPlayModePanel')
export class UIPlayModePanel extends UIPanel {

    @property(UIButton) btnMatch: UIButton = null;
    @property(UIButton) btnFriend: UIButton = null;
    @property(UIButton) btnBack: UIButton = null;

    protected onShow(): void {
        if (this.btnMatch) this.btnMatch.onClick = this.onClickMatch.bind(this);
        if (this.btnFriend) this.btnFriend.onClick = this.onClickFriend.bind(this);
        if (this.btnBack) this.btnBack.onClick = this.onClickBack.bind(this);
    }

    public onClickMatch() {
        this.stack?.showByType(UIMatchDeckPanel);
    }
    public onClickFriend() {
        this.stack?.showByType(UIFriendPanel);
    }
    public onClickBack() { this.stack?.back(); }
}
