import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';

const { ccclass } = _decorator;

/**
 * 三级面板（预留）：自定义卡组配置
 * - 当前流程中，点击“自定义卡组”直接进入可选图鉴，本面板作为后续扩展位。
 * - 若需要更复杂的编辑器/过滤器，可在此面板实现并与图鉴交互。
 */
@ccclass('UICustomDeckPanel')
export class UICustomDeckPanel extends UIPanel {
    public onClickBack() { this.stack?.back(); }
}
