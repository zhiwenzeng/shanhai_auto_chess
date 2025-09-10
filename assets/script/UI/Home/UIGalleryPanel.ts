import { _decorator, Node, ToggleContainer, Label } from 'cc';
import { UIPanel } from '../UIPanel';

const { ccclass, property } = _decorator;

/**
 * 图鉴面板（只读 / 可选）
 * - 阶段切换：1~6，显示对应阶段的单位、食物、装备列表。
 * - 只读模式：用于查看卡包内容（禁用交互）。
 * - 可选模式：用于自定义卡组（允许选择，提供确认回调）。
 * - 提供确认/取消/返回操作；实际条目填充与选中视觉由 Prefab 接入。
 */
@ccclass('UIGalleryPanel')
export class UIGalleryPanel extends UIPanel {
    @property(ToggleContainer) stageTabs: ToggleContainer = null; // 阶段1-6
    @property(Node) unitList: Node = null;   // 单位列表容器（只读）
    @property(Node) foodList: Node = null;   // 食物列表容器（只读）
    @property(Node) equipList: Node = null;  // 装备列表容器（只读）
    @property(Label) title: Label = null;

    // 模式：只读 or 可选
    private _readOnly: boolean = true;
    private _stage: number = 1;
    // 可选模式下的选择缓存（按阶段）
    private _selected = {
        units: new Map<number, Set<number>>(),  // stage -> ids
        foods: new Map<number, Set<number>>(),
        equips: new Map<number, Set<number>>()
    };
    private _confirmCallback: (result: { stage: number; units: number[]; foods: number[]; equips: number[] }) => void = null;

    protected onShow(): void {
        this._updateTitle(this._stage);
        // TODO: 根据当前卡包与阶段刷新列表（单位/食物/装备）
        // 只读模式：禁用交互；可选模式：启用交互
        this._applyInteractable();
    }

    public onStageChanged(event?: any, custom?: string) {
        const stage = Number(custom ?? 1) || 1;
        this._stage = stage;
        this._updateTitle(stage);
        // TODO: 刷新列表（只读 / 可选）
    }

    private _updateTitle(stage: number) {
        if (this.title) this.title.string = `图鉴 - 阶段 ${stage}`;
    }

    private _applyInteractable() {
        // 这里按需遍历子节点，控制按钮/Toggle可点击性
        // 由于实际Item未实现，此处留空；由Prefab绑定事件实现。
    }

    // ——— 对外接口 ———
    public openReadOnly(stage: number = 1, title?: string) {
        this._readOnly = true;
        this._stage = stage;
        if (title && this.title) this.title.string = title;
        this.show();
    }

    public openSelectable(stage: number = 1, onConfirm?: UIGalleryPanel['_confirmCallback']) {
        this._readOnly = false;
        this._stage = stage;
        this._confirmCallback = onConfirm ?? null;
        this.show();
    }

    // ——— 可选模式：条目点击回调（由Prefab的按钮传入id）———
    public onClickUnit(event?: any, custom?: string) { this._toggleSelect(this._selected.units, custom); }
    public onClickFood(event?: any, custom?: string) { this._toggleSelect(this._selected.foods, custom); }
    public onClickEquip(event?: any, custom?: string) { this._toggleSelect(this._selected.equips, custom); }

    private _toggleSelect(bucket: Map<number, Set<number>>, custom?: string) {
        if (this._readOnly) return;
        const id = Number(custom ?? 0);
        if (!id) return;
        let set = bucket.get(this._stage);
        if (!set) { set = new Set<number>(); bucket.set(this._stage, set); }
        if (set.has(id)) set.delete(id); else set.add(id);
        // TODO: 更新该Item的选中视觉
    }

    // ——— 底部按钮：确认/取消/返回 ——
    public onClickConfirm() {
        if (this._readOnly) { this.hide(); return; }
        const res = {
            stage: this._stage,
            units: Array.from(this._selected.units.get(this._stage) ?? []),
            foods: Array.from(this._selected.foods.get(this._stage) ?? []),
            equips: Array.from(this._selected.equips.get(this._stage) ?? []),
        };
        this._confirmCallback?.(res);
        this.hide();
    }

    public onClickCancel() { this.hide(); }
    public onClickBack() { this.stack?.back(); }
}
