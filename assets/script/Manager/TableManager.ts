import { _decorator, Node, Component, JsonAsset } from "cc";
import { ASingleton } from "../ASingleton";
import { ResourceManager } from "./ResourceManager";
import { EventManager } from "./EventManager";
import { EEventType } from "../Common/Enums";
import { Const, ICharacterConfig } from "../Common/Define";

const { ccclass, property } = _decorator;

@ccclass("TableManager")
export class TableManager extends ASingleton {
    
    public static get Instance(): TableManager {
        return this.getInstance(TableManager);
    }

    public characters: Map<number, ICharacterConfig> = new Map();

    protected onInitialize(): void {
        let charactersJson = ResourceManager.Instance.load<JsonAsset>(Const.TableCharacterPath).json;
        for (let key in charactersJson) {
            let character: ICharacterConfig = charactersJson[key];
            this.characters.set(character.id, character);
        }
    }
}