import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';

const { ccclass } = _decorator;

/**
 * 三级面板：加入房间
 * - 输入房间号并确认加入（输入与校验逻辑待接入）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UIJoinPanel')
export class UIJoinPanel extends UIPanel {
    public onClickBack() { this.stack?.back(); }
}
