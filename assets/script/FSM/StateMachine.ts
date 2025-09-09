import { Animation } from "cc"
import { AnimationUtil } from "../Util/AnimationUtil";
import { State } from "./State";
import { TFunction } from "../Common/Define";
import { AnimationComponent } from "../Character/AnimationComponent";

export class StateMachine {
    private _counter: number = 0;
    private _owner: any = null;
    private _current: State = null;
    private _defaultStateKey: State = null;
    private _states: Map<any, State> = new Map();
    public get owner() {
        return this._owner;
    }
    constructor(owner: any) {
        this._owner = owner;
    }
    public setDefaultState(key: any) {
        this._defaultStateKey = key;
        this.changeState(key);
    }
    public addState(key: any, state: State) {
        this._states.set(key, state);
    }
    public changeState(key: any) {
        let oldState = this._current;
        if (oldState) {
            oldState.exit();
        }
        this._current = this._states.get(key);
        if (this._current) {
            this._current.enter();
        }
    }
    public clear() {
        this._current = null;
        this._states.clear();
    }
    public start() {
        this._counter--;
        this._counter = Math.max(0, this._counter);
        if (this._counter <= 0 && this._current == null) {
            if (this._defaultStateKey) {
                this.changeState(this._defaultStateKey);
            }
        }
    }
    public update(dt: number) {
        this._current?.update();
    }
    public stop() {
        this._counter++;
        this._current?.exit();
        this._current = null;
    }
    public trigger(animation: AnimationComponent, name: string, finishCallback?: TFunction, stopCallback?: TFunction) {
        AnimationUtil.play(animation, name, finishCallback, () => {
            this.start();
            stopCallback?.();
        });
        this.stop();
    }
    public stopTrigger(animation: AnimationComponent) {
        animation.stop();
    }
}


