import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UICreateDeckPanel } from './UICreateDeckPanel';

const { ccclass } = _decorator;

/**
 * 三级面板：建立房间配置
 * - 选项：玩家上限、是否与房主相同卡包（UI控件待接入）。
 * - 确定后进入“选择卡包”面板。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UICreatePanel')
export class UICreatePanel extends UIPanel {
    public onClickConfirm() {
        this.stack?.showByType(UICreateDeckPanel);
    }
    public onClickBack() { this.stack?.back(); }
}
