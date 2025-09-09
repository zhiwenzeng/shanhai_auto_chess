import { _decorator, Component, Node } from 'cc';
import { AComponent } from '../AComponent';
import { EFaction } from '../Common/Enums';

const { ccclass, property } = _decorator;

@ccclass('TeamComponent')
export class TeamComponent extends AComponent {
    @property({ type: EFaction })
    public faction: EFaction = EFaction.None;

    public isEnemy(otherFaction: EFaction): boolean {
        return this.faction != otherFaction;
    }
}

