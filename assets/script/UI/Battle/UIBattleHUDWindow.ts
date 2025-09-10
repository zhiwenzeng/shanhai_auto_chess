import { _decorator, Component, Node, Label } from 'cc';
import { UIWindow } from '../UIWindow';
import { UIManager } from '../../Manager/UIManager';
import { EUIWindow } from '../../Common/Enums';
import { GameModel } from '../../Model/GameModel';
import { ModelManager } from '../../Manager/ModelManager';
const { ccclass, property } = _decorator;

@ccclass('UIBattleHUDWindow')
export class UIBattleHUDWindow extends UIWindow {
    @property(Label) goldLabel: Label = null;
    @property(Label) lifeLabel: Label = null;
    @property(Label) roundLabel: Label = null;
    @property(Label) winLabel: Label = null;

    private _model: GameModel;

    protected onShow(): void {
        this._model = ModelManager.GetModel(GameModel);
        this.refresh();
    }

    public refresh() {
        // Gold 未纳入 GameModel，显示规则回合收入或由外部设置
        const goldText = `金币: ${10}`; // 占位
        const lifeText = `生命: ${this._model?.life ?? 0}`;
        const roundText = `回合: ${this._model?.turn ?? 1}`;
        const winText = `胜利: ${this._model?.winCount ?? 0}`;
        if (this.goldLabel) this.goldLabel.string = goldText;
        if (this.lifeLabel) this.lifeLabel.string = lifeText;
        if (this.roundLabel) this.roundLabel.string = roundText;
        if (this.winLabel) this.winLabel.string = winText;
    }

    public onClickRefreshShop() {
        // TODO: 刷新商店逻辑
    }

    public onClickNextRound() {
        // TODO: 进入下一回合逻辑
    }

    public onClickOpenGallery() {
        UIManager.Instance.show(EUIWindow.Gallery);
    }

    public onClickSetting() {
        UIManager.Instance.show(EUIWindow.Setting);
    }
}
