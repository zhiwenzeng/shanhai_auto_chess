import { _decorator, Label, Node } from 'cc';
import { UIView } from '../UIView';
import { UIButton } from '../Common/UIButton';

const { ccclass, property } = _decorator;

/**
 * 卡组按钮项（可选/非选 & 信息按钮）
 * 需要在预制上挂载：
 * - btnSelect: 主按钮
 * - btnInfo: 左上角信息按钮
 * - normalNode / selectedNode: 两种可视状态的容器（或图片）。
 * - title: 显示卡组名
 */
@ccclass('UIMatchDeckItem')
export class UIMatchDeckItem extends UIView {
    @property(UIButton) btnSelect: UIButton = null;
    @property(UIButton) btnInfo: UIButton = null;
    @property(Node) normalNode: Node = null;
    @property(Node) selectedNode: Node = null;
    @property(Label) title: Label = null;

    private _onSelect: (() => void) | null = null;
    private _onInfo: (() => void) | null = null;

    protected onShow(): void {
        if (this.btnSelect) this.btnSelect.onClick = this._handleSelect.bind(this);
        if (this.btnInfo) this.btnInfo.onClick = this._handleInfo.bind(this);
        this._applyTitle();
    }

    public setData(id: number, name: string, onSelect?: () => void, onInfo?: () => void) {
        this._onSelect = onSelect || null;
        this._onInfo = onInfo || null;
        this._applyTitle();
    }

    public setSelected(selected: boolean) {
        if (this.selectedNode) this.selectedNode.active = selected;
        if (this.normalNode) this.normalNode.active = !selected;
    }

    private _applyTitle() {
        if (this.title) this.title.string = this._name || '';
    }

    private _handleSelect() { this._onSelect?.(); }
    private _handleInfo() { this._onInfo?.(); }
}

