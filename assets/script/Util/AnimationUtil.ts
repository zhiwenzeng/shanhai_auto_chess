import { _decorator, Component, Node, Animation } from 'cc';
import { TClass, TFunction } from '../Common/Define';
import { AnimationComponent } from '../Character/AnimationComponent';

export class AnimationUtil {
    public static play(animation: AnimationComponent, name: string, finishCallback?: TFunction, stopCallback?: TFunction) {
        // console.log("play" + name);
        animation.play(name);
        if (finishCallback) {
            animation.onFinish = () => {
                // console.log("finish" + name);
                finishCallback();
            }
        }
        if (stopCallback) {
            animation.onStop = () => {
                // console.log("stop" + name);
                stopCallback();
            }
        }
    }
}


