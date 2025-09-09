import { _decorator, Component, Node } from 'cc';
import { BTNode, BTState } from './BTNode';
import { BTComposite } from './BTComposite';

export class BTSelectorRandom extends BTComposite {
    private _weights: number[] = [];
    private _randomIndex: number = 0;
    public enter(): void {
        if (this._children.length === 0) return;
        let totalWeight = 0;
        for (let i = 0; i < this._weights.length; i++) {
            totalWeight += this._weights[i];
        }
        const randomValue = Math.random() * totalWeight;
        let currentWeight = 0;
        for (let i = 0; i < this._weights.length; i++) {
            currentWeight += this._weights[i];
            if (randomValue <= currentWeight) {
                this._randomIndex = i;
                break;
            }
        }
        const randomChild = this._children[this._randomIndex];
        randomChild.enter();
    }
    public addChildByWeight(child: BTNode, weight: number = 1) {
        this.addChild(child);
        this._weights[this._children.length - 1] = weight;
    }
    public execute(deltaTime: number): BTState {
        super.execute(deltaTime);
        if (this._children.length === 0) return BTState.Failure;
        const randomChild = this._children[this._randomIndex];
        const result = randomChild.execute(deltaTime);
        if (result === BTState.Running) return BTState.Running;
        randomChild.exit();
        if (result === BTState.Success) return BTState.Success;
        return BTState.Failure;
    }
}

