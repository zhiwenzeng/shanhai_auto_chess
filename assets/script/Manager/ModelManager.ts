import { _decorator, Component, Node } from 'cc';
import { GameModel } from '../Model/GameModel';
import { StorageUtil } from '../Util/StorageUtil';
import { TClass } from '../Common/Define';

export class ModelManager {
    private static GameModelKey: string = "GameModelKey";

    private static _Models: Map<any, any> = new Map<any, any>();

    public static AddModel<T>(cls: TClass<T>, model: any) { 
        ModelManager._Models.set(cls, model);
    }

    public static GetModel<T>(cls: TClass<T>): T {
        return ModelManager._Models.get(cls);
    }

    public static Load(): void {
        ModelManager._LoadModel(GameModel, ModelManager.GameModelKey);
    }

    private static _LoadModel<T>(cls: TClass<T>, key: string) {
        let JsonString = StorageUtil.get(key);
        if (JsonString) {
            ModelManager.AddModel(cls, JSON.parse(JsonString));
        }
        else {
            ModelManager.AddModel(cls, new cls());
        }
    }

    public static Save(): void {
        StorageUtil.set(ModelManager.GameModelKey, 
            JSON.stringify(ModelManager.GetModel(GameModel)));
    }
}

