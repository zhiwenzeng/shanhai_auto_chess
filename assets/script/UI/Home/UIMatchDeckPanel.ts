import { _decorator, Node, Prefab, instantiate } from 'cc';
import { UIPanel } from '../UIPanel';
import { UIGalleryPanel } from './UIGalleryPanel';
import { UIMatchDeckItem } from './UIMatchDeckItem';

const { ccclass, property } = _decorator;

/**
 * 三级面板：匹配 - 选择卡包
 * - 预设卡包列表（待接入数据）与“自定义卡组”。
 * - “自定义卡组”会打开可选图鉴；
 * - “图鉴”按钮打开只读图鉴（查看当前卡包内容）。
 * - 提供返回按钮回到上一级。
 */
@ccclass('UIMatchDeckPanel')
export class UIMatchDeckPanel extends UIPanel {
    // 布局列表容器（应在预制上挂 Layout 组件）
    @property(Node) content: Node = null;
    // 列表项模板（卡组按钮项的预设）
    @property(Prefab) itemPrefab: Prefab = null;

    private _items: UIMatchDeckItem[] = [];
    private _selectedIndex: number = -1;
    private _data: { id: number, name: string }[] = [];

    protected onShow(): void {
        // TODO: 接入真实卡包数据。这里先用占位数据
        if (this._data.length === 0) {
            this._data = [
                { id: 1, name: '标准卡包' },
                { id: 2, name: '进阶卡包' },
            ];
        }
        this._buildList();
    }

    private _buildList() {
        if (!this.content || !this.itemPrefab) return;
        this.content.removeAllChildren();
        this._items.length = 0;
        this._selectedIndex = Math.min(this._selectedIndex, this._data.length - 1);
        for (let i = 0; i < this._data.length; i++) {
            const d = this._data[i];
            const node = instantiate(this.itemPrefab);
            this.content.addChild(node);
            const item = node.getComponent(UIMatchDeckItem);
            if (!item) continue;
            item.setData(d.id, d.name, () => this._onSelect(i), () => this._onInfo(d.id));
            this._items.push(item);
        }
        if (this._selectedIndex < 0 && this._items.length > 0) {
            this._onSelect(0);
        } else {
            this._refreshSelection();
        }
    }

    private _onSelect(index: number) {
        this._selectedIndex = index;
        this._refreshSelection();
    }

    private _refreshSelection() {
        this._items.forEach((it, idx) => it.setSelected(idx === this._selectedIndex));
    }

    private _onInfo(packId: number) {
        const gallery = this.stack?.getByType(UIGalleryPanel) as UIGalleryPanel;
        gallery?.openReadOnly(packId, '图鉴 - 卡包');
        this.stack?.showByType(UIGalleryPanel);
    }
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
        const sel = this._selectedIndex >= 0 ? this._data[this._selectedIndex]?.id : 1;
        gallery?.openReadOnly(sel ?? 1, '图鉴 - 卡包');
        this.stack?.showByType(UIGalleryPanel);
    }

    public onClickBack() { this.stack?.back(); }
}
