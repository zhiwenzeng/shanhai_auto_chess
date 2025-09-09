import { _decorator, Component, Node } from 'cc';
import { ASingleton } from '../ASingleton';
const { ccclass, property } = _decorator;

interface TimerTask {
    id: number;
    callback: Function;
    remaining: number;
    interval: number;
    repeat: boolean;
}

@ccclass('TimerManager')
export class TimerManager extends ASingleton {
    public static get Instance(): TimerManager {
        return this.getInstance(TimerManager);
    }
    
    public static get time(): number {
        return this.Instance._time;
    }
    public static get deltaTime(): number {
        return this.Instance._deltaTime;
    }
    
    private _time: number = 0;
    private _deltaTime: number = 0;
    private _tasks: TimerTask[] = [];
    private _idCount: number = 0;
    private _taskCallbacks: Function[] = [];
    private _taskToRemove: number[] = [];

    update(deltaTime: number) {
        this._time += deltaTime;
        this._deltaTime = deltaTime;
        this._taskCallbacks.length = 0;
        this._taskToRemove.length = 0;
        for (let i = 0; i < this._tasks.length; i++) {
            const task = this._tasks[i];
            task.remaining -= deltaTime;

            if (task.remaining <= 0) {
                this._taskCallbacks.push(task.callback);

                if (task.repeat) {
                    task.remaining = task.interval;
                } else {
                    this._taskToRemove.push(i);
                }
            }
        }
        for (let i = this._taskToRemove.length - 1; i >= 0; i--) {
            this._tasks.splice(this._taskToRemove[i], 1);
        }
        this._taskCallbacks.forEach(cb => cb());
    }

    scheduleOnce(callback: Function, delay: number = 0.0): number {
        return this.addTask(callback, delay, false, delay);
    }

    schedule(callback: Function, interval: number, delay?: number): number {
        const initialDelay = delay ?? interval;
        return this.addTask(callback, initialDelay, true, interval);
    }

    unschedule(id: number): void {
        const index = this._tasks.findIndex(task => task.id === id);
        if (index !== -1) this._tasks.splice(index, 1);
    }

    private addTask(callback: Function, remaining: number, repeat: boolean, interval: number): number {
        const id = this._idCount++;
        this._tasks.push({ id, callback, remaining, interval, repeat });
        return id;
    }
}
