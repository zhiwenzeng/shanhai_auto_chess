import { _decorator, Component, Node, Label } from 'cc';
import { UIWindow } from '../UIWindow';
import { UIManager } from '../../Manager/UIManager';
import { EUIWindow } from '../../Common/Enums';
import { GameModel } from '../../Model/GameModel';
import { ModelManager } from '../../Manager/ModelManager';
import { Const } from '../../Common/Define';
const { ccclass, property } = _decorator;

@ccclass('UIBattleHUDWindow')
export class UIBattleHUDWindow extends UIWindow {
    @property(Label) gold: Label = null;
    @property(Label) life: Label = null;
    @property(Label) round: Label = null;
    @property(Label) winCount: Label = null;

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
        const winText = `胜利: ${this._model?.winCount ?? 0}/${Const.Rule.ConditionWinCount}`;
        if (this.gold) this.gold.string = goldText;
        if (this.life) this.life.string = lifeText;
        if (this.round) this.round.string = roundText;
        if (this.winCount) this.winCount.string = winText;
    }

    public onClickRefreshShop() {
        // TODO: 刷新商店逻辑
    }

    public onClickNextRound() {
        // TODO: 进入下一回合逻辑
    }

    public onClickOpenGallery() {

    }

    public onClickSetting() {
        UIManager.Instance.show(EUIWindow.Setting);
    }
}
