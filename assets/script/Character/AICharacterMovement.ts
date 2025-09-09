import { _decorator, CCFloat, CircleCollider2D, Collider2D, Component, math, Node, Rect, RigidBody2D, Size, v2, v3, Vec2, Vec3 } from 'cc';
import { MathUtil } from '../Util/MathUtil';
import { AComponent } from '../AComponent';
import { TFunction } from '../Common/Define';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('AICharacterMovement')
@requireComponent(RigidBody2D)
export class AICharacterMovement extends AComponent {

    @property(CCFloat)
    public speed: number = 5;

    public needFlip: boolean = false;
    public onMoveToFinish: TFunction = null;

    private _rb: RigidBody2D = null;
    private _collider: Collider2D = null;
    private _direction: Vec2 = v2(0, 0);
    private _isMoveToFinish: boolean = true;
    private _isMoveToTarget: boolean = false;
    private _destinationTarget: AComponent = null;
    private _destinationWorldPosition: Vec2 = v2(0, 0);
    private _acceptDistance: number = 0;

    private _enable: boolean = true;
    private _canFly: boolean = false;
    private _forward: number = 1;

    public get enable() {
        return this._enable;
    }

    public set enable(value: boolean) {
        if (!value) {
            this.linearVelocity = v2(0, 0);
        }
        this._enable = value;
    }

    public get worldAABB(): Rect {
        return this._collider.worldAABB;
    }

    public get canFly() {
        return this._canFly;
    }

    public set canFly(value: boolean) {
        this._canFly = value;
        this._rb.gravityScale = 0;
    }
    
    public get forward() {
        return this._forward;
    }

    public get linearVelocity() {
        return this._rb.linearVelocity;
    }

    public set linearVelocity(v: Vec2) {
        this._rb.linearVelocity = v;
        if (v.x != 0) {
            this.setForward(v.x);
        }
    }

    public set linearVelocityX(x: number) {
        this.linearVelocity = v2(x, this.linearVelocity.y);
    }

    public set direction(value: Vec2) {
        this._direction = value.normalize();
    }

    public get direction() {
        return this._direction;
    }

    public get isMoveToFinish() {
        return this._isMoveToFinish;
    }

    public moveToDestination(destination: Vec2, acceptDistance: number = 1) {
        if (!this.enable) {
            return;
        }
        let offset = v2();
        if (!this.canFly) {
            destination.y = this.worldPosition.y;
        }
        Vec2.subtract(offset, destination, MathUtil.convertV2(this.worldPosition));
        this._acceptDistance = Math.max(acceptDistance, this.speed);
        this.setForward(offset.x);
        if (offset.length() < this._acceptDistance) {
            this.worldPosition = MathUtil.convertV3(this._destinationWorldPosition);
            this.stopMoveTo();
            return;
        }
        this._isMoveToTarget = false;
        this._isMoveToFinish = false;
        this._destinationWorldPosition = destination;
    }

    public moveToTarget(target: AComponent, acceptDistance: number) {
        if (!this.enable) {
            return;
        }
        let offset = v2();
        let destination = MathUtil.convertV2(target.worldPosition);
        if (!this.canFly) {
            destination.y = this.worldPosition.y;
        }
        Vec2.subtract(offset, destination, MathUtil.convertV2(this.worldPosition));
        this._acceptDistance = Math.max(acceptDistance, this.speed);
        this.setForward(offset.x);
        if (offset.length() < this._acceptDistance) {
            this.stopMoveTo();
            return;
        }
        this._isMoveToTarget = true;
        this._isMoveToFinish = false;
        this._destinationTarget = target;
    }

    public stopMoveTo() {
        this.abortMoveTo();
        this.onMoveToFinish?.();
    }

    public abortMoveTo() {
        this._isMoveToFinish = true;
        this._isMoveToTarget = false;
        this._direction = v2(0, 0);
        this.linearVelocityX = 0;
    }

    protected onLoad(): void {
        this._rb = this.getComponent(RigidBody2D);
        this._collider = this.getComponent(Collider2D);
    }

    protected update(dt: number): void {
        if (!this.enable) {
            return;
        }
        if (this._isMoveToFinish) {
            return;
        }
        let offset = v2();
        if (this._isMoveToTarget) {
            if (this._destinationTarget == null || this._destinationTarget.isDestroy) {
                this.stopMoveTo();
                return;
            }
            Vec2.subtract(offset, MathUtil.convertV2(this._destinationTarget.worldPosition), 
                MathUtil.convertV2(this.worldPosition));
        }
        else {
            Vec2.subtract(offset, this._destinationWorldPosition, MathUtil.convertV2(this.worldPosition));
        }
        if (!this.canFly) {
            offset.y = 0;
        }
        let distance = offset.length();
        if (distance < this._acceptDistance) {
            this.stopMoveTo();
            return;
        }
        this._direction = offset.normalize();
        let v = v2();
        Vec2.multiplyScalar(v, this._direction, Math.min(this.speed, distance));
        if (!this.canFly) {
            v.y = this._rb.linearVelocity.y;
        }
        this.linearVelocity = v;
    }

    public setForward(forward: number, isForce: boolean = false) {
        if (this.needFlip || isForce) {
            this._forward = forward > 0 ? 1 : -1;
            let scale = v3(this.scale);
            scale.x = this._forward * Math.abs(scale.x);
            this.scale = scale;
        }
    }
}