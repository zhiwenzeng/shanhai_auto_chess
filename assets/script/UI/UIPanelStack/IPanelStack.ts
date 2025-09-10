import { TClass } from '../../Common/Define';

export interface IPanelStack {
    registerPanels(...panels: any[]): void;
    // 显示面板类型；keepTopVisible 为 true 时，不隐藏当前栈顶（叠加显示）
    showByType<T>(cls: TClass<T>, keepTopVisible?: boolean): void;
    getByType<T>(cls: TClass<T>): T | null;
    back(): boolean;
    reset(): void;
}
