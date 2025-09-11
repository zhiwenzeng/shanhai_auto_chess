import { _decorator, Node } from 'cc';
import { UIPanel } from '../UIPanel';
import { IPanelStack } from './IPanelStack';
import { TClass } from '../../Common/Define';
import { AComponent } from '../../AComponent';

const { ccclass, property } = _decorator;

/**
 * UIStackPanel：管理 UIPanel 的栈式导航。
 * - 无需 init；在显示时自动注册面板。
 * - back() 时隐藏当前面板并返回上一面板；若无历史，则仅清空当前。
 */
@ccclass('UIStackPanel')
export class UIStackPanel implements IPanelStack {
    @property([UIPanel]) panels: UIPanel[] = [];

    private _stack: UIPanel[] = [];
    private _overlayDepth: number = 0; // 连续叠加层数
    private _current: UIPanel = null;
    private _typeIndex: Map<Function, UIPanel> = new Map();

    public get currentPanel(): UIPanel { return this._current; }
    public get historyLength(): number { return Math.max(0, this._stack.length - 1); }

    // ——— 注册与显示 ———
    public registerPanels(...panels: UIPanel[]) {
        if (!panels) return;
        for (const p of panels) this._ensureRegistered(p);
    }

    public showByType<T>(cls: TClass<T>, keepTopVisible: boolean = false) {
        const p = this._getByType(cls) as UIPanel;
        if (!p) return;

        const prev = this._stack.length > 0 ? this._stack[this._stack.length - 1] : null;
        if (prev === p) {
            // 已经在栈顶，无需处理
            return;
        }

        if (prev) {
            if (keepTopVisible) {
                // 叠加：保留上一层显示
                this._overlayDepth += 1;
            } else {
                // 非叠加：隐藏上一层
                prev.hide();
                this._overlayDepth = 0;
            }
        }

        this._stack.push(p);
        this._current = p;
        p.show();
    }

    public getByType<T>(cls: TClass<T>): T | null {
        return this._getByType(cls);
    }

    public back(): boolean {
        if (this._stack.length === 0) return false;

        const cur = this._stack.pop();
        cur?.hide();

        const prev = this._stack.length > 0 ? this._stack[this._stack.length - 1] : null;
        if (prev) {
            if (this._overlayDepth > 0) {
                // 上一次为叠加：上一层本来就可见
                this._overlayDepth -= 1;
            } else {
                // 非叠加：需要重新显示上一层
                prev.show();
            }
        }
        this._current = prev ?? null;
        return true;
    }

    public reset() {
        this._stack.length = 0;
        this._overlayDepth = 0;
        this._current = null;
        this.panels?.forEach(p => p && p.hide());
    }

    // ——— 内部实现 ———

    private _ensureRegistered(panel: UIPanel) {
        if (!this.panels) this.panels = [];
        if (this.panels.indexOf(panel) < 0) this.panels.push(panel);
        if (panel && panel.setPanelStack) panel.setPanelStack(this);
        // 记录类型索引（按构造函数）
        try {
            const ctor = (panel as any)?.constructor as Function;
            if (ctor) this._typeIndex.set(ctor, panel);
        } catch {}
    }

    private _getByType<T>(cls: TClass<T>): T | null {
        if (!cls) return null;
        const cached = this._typeIndex.get(cls);
        if (cached) return cached as T;
        const arr = this.panels ?? [];
        for (const p of arr) {
            if (p instanceof cls) {
                this._typeIndex.set(cls, p);
                return p as T;
            }
        }
        return null;
    }
}
