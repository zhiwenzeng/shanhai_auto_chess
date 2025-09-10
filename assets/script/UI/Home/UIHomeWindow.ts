import { _decorator } from 'cc';
import { UIWindow } from '../UIWindow';
import { UIStackPanel } from '../UIPanelStack/UIStackPanel';
import { UIPlayModePanel } from './UIPlayModePanel';
import { UIMatchDeckPanel } from './UIMatchDeckPanel';
import { UICustomDeckPanel } from './UICustomDeckPanel';
import { UIFriendPanel } from './UIFriendPanel';
import { UIJoinPanel } from './UIJoinPanel';
import { UICreatePanel } from './UICreatePanel';
import { UICreateDeckPanel } from './UICreateDeckPanel';
import { UIGalleryPanel } from './UIGalleryPanel';
import { UIHomePanel } from './UIHomePanel';

const { ccclass, property } = _decorator;

/**
 * 主页窗口（Home）
 * - 顶部三个主按钮：游玩、卡包、设置。
 * - 内部使用 UIStackPanel 组织二/三级面板的栈式导航：
 *   1) 游玩 -> 二级：匹配 / 好友；
 *   2) 匹配 -> 三级：卡包选择（预设、自定义）、只读图鉴按钮；
 *   3) 好友 -> 三级：加入 / 建立；建立后进入选择卡包；
 *   4) 图鉴面板：可只读/可选（由上级面板打开时配置）。
 * - 提供返回上一级、打开设置等常用入口。
 */
@ccclass('UIHomeWindow')
export class UIHomeWindow extends UIWindow {
    // 一级主页按钮面板
    @property(UIHomePanel) homePanel: UIHomePanel = null;
    @property(UIStackPanel) stackPanel: UIStackPanel = null;
    @property(UIPlayModePanel) playModePanel: UIPlayModePanel = null;
    @property(UIMatchDeckPanel) matchDeckPanel: UIMatchDeckPanel = null;
    @property(UICustomDeckPanel) customDeckPanel: UICustomDeckPanel = null;
    @property(UIFriendPanel) friendPanel: UIFriendPanel = null;
    @property(UIJoinPanel) joinPanel: UIJoinPanel = null;
    @property(UICreatePanel) createPanel: UICreatePanel = null;
    @property(UICreateDeckPanel) createDeckPanel: UICreateDeckPanel = null;
    @property(UIGalleryPanel) galleryPanel: UIGalleryPanel = null;

    protected onOpen(): void {
        this.stackPanel.registerPanels(
            this.homePanel,
            this.playModePanel,
            this.matchDeckPanel,
            this.customDeckPanel,
            this.friendPanel,
            this.joinPanel,
            this.createPanel,
            this.createDeckPanel,
            this.galleryPanel,
        );
    }

    protected onShow(): void {
        this.stackPanel.reset();
        // 打开 Home 按钮面板
        this.stackPanel.showByType(UIHomePanel);
    }
}
