import { _decorator, Component, Node } from 'cc';
import { AComponent } from '../AComponent';
import { BehaviorTree } from '../BehaviorTree/BehaviorTree';
import { Blackboard } from '../BehaviorTree/Blockboard';
const { ccclass, property } = _decorator;

@ccclass('AIComponent')
export class AIComponent extends AComponent {
    private _behaviorTree: BehaviorTree = null;

    public set enable(value: boolean) {
        this._behaviorTree.enable = value;
    }

    public get enable(): boolean {
        return this._behaviorTree.enable;
    }

    public get behaviorTree(): BehaviorTree {
        return this._behaviorTree;
    }

    public set behaviorTree(behaviorTree: BehaviorTree) {
        this._behaviorTree = behaviorTree;
    }

    public get blackboard(): Blackboard {
        return this._behaviorTree.blackboard;
    }

    protected update(dt: number): void {
        if (this._behaviorTree) {
            this._behaviorTree.update(dt);
        }
    }
}

