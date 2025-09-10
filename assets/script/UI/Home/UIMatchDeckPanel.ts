import { _decorator } from 'cc';
import { UIPanel } from '../UIPanel';
import { UICustomDeckPanel } from './UICustomDeckPanel';
import { UIGalleryPanel } from './UIGalleryPanel';

const { ccclass } = _decorator;

/**
 * 三级面板：匹配 - 选择卡包
 * - 预设卡包列表（待接入数据）与“自定义卡组”。
 * - “自定义卡组”会打开可选图鉴；
 * - “图鉴”按钮打开只读图鉴（查看当前卡包内容）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UIMatchDeckPanel')
export class UIMatchDeckPanel extends UIPanel {
    public onClickCustomDeck() {
        // 自定义卡组：进入可选图鉴
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openSelectable(1, (res) => {
            // TODO: 保存选择的卡组配置（res）
        });
        this.stack?.showByType(UIGalleryPanel);
    }

    // 卡包图鉴（只读）
    public onClickGallery() {
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openReadOnly(1, '图鉴 - 卡包');
        this.stack?.showByType(UIGalleryPanel);
    }

    public onClickBack() { this.stack?.back(); }
}
