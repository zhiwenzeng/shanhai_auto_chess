import { Blackboard } from "./Blockboard";
import { BTNode, BTState } from "./BTNode";
import { BTService } from "./BTService";

export abstract class BTComposite extends BTNode {
    protected _currentChildIndex: number = 0;
    protected _children: BTNode[] = [];
    private _services: BTService[] = [];
    public setBlackboard(blackboard: Blackboard) {
        super.setBlackboard(blackboard);
        this._children.forEach(c => c.setBlackboard(blackboard));
        this._services.forEach(s => s.setBlackboard(blackboard));
    }
    public setOwner(owner: Node) {
        super.setOwner(owner);
        this._children.forEach(c => c.setOwner(owner));
        this._services.forEach(s => s.setOwner(owner));
    }
    public addChild(child: BTNode): void {
        child.setBlackboard(this._blackboard);
        child.setOwner(this._owner);
        this._children.push(child);
    }
    public addService(service: BTService): void {
        service.setBlackboard(this._blackboard);
        service.setOwner(this._owner);
        this._services.push(service);
    }
    public enter(): void {
        super.enter();
        this._currentChildIndex = 0;
        if (this._children.length > 0) {
            this._children[this._currentChildIndex].enter();
        }
    }
    public execute(deltaTime: number): BTState {
        this._services.forEach(s => s.update(deltaTime));
        return BTState.Running;
    }
    public exit(): void {
        super.exit();
    }
    public abort(): void {
        super.abort();
        this._children.forEach(c => c.abort());
        this._currentChildIndex = 0;
    }
}