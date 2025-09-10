import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UIGalleryPanel } from './UIGalleryPanel';

const { ccclass } = _decorator;

/**
 * 选择卡包（建立房间后）
 * - 用于房主创建后选择卡包：
 *   - 打开只读图鉴（查看全部内容）。
 *   - 进入可选图鉴（自定义卡组）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UICreateDeckPanel')
export class UICreateDeckPanel extends UIPanel {
    // 只读图鉴
    public onClickGallery() {
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openReadOnly(1, '图鉴 - 卡包');
        this.stack?.showByType(UIGalleryPanel);
    }

    // 自定义卡组：进入可选图鉴
    public onClickCustomDeck() {
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openSelectable(1, (res) => {
            // TODO: 保存选择的卡组配置（res）
        });
        this.stack?.showByType(UIGalleryPanel);
    }

    public onClickBack() { this.stack?.back(); }
}
