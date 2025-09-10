import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UIJoinPanel } from './UIJoinPanel';
import { UICreatePanel } from './UICreatePanel';

const { ccclass } = _decorator;

/**
 * 二级面板：与好友一起玩
 * - 按钮：加入房间、建立房间。
 * - 功能：进入对应的三级面板（输入房间号 / 创建配置）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UIFriendPanel')
export class UIFriendPanel extends UIPanel {
    public onClickJoin() { this.stack?.showByType(UIJoinPanel); }
    public onClickCreate() { this.stack?.showByType(UICreatePanel); }
    public onClickBack() { this.stack?.back(); }
}
