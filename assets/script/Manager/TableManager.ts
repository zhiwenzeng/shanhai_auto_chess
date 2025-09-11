import { _decorator, BufferAsset, log, resources } from "cc";
import { ASingleton } from "../ASingleton";
import { ResourceManager } from "./ResourceManager";
import { Tables } from "../ExcelGen/schema";
import ByteBuf from "../luban/ByteBuf";

const { ccclass, property } = _decorator;

@ccclass("TableManager")
export class TableManager extends ASingleton {
    public static tables: Tables = null;
    private static dataMap: Map<string, Uint8Array> = new Map();
    public static fileNames: string[] = [];
    
    public static get Instance(): TableManager {
        return this.getInstance(TableManager);
    }

    private _tables: Tables | null = null;

    protected onInitialize(): void {
        
    }

    public loadConfigName(): void
    {
        TableManager.fileNames = Tables.getTableNames()
    }

    public async loadAll()
    {
        this.loadConfigName();
        for (let fileName of TableManager.fileNames)
        {
            let path = `excel_gen/${fileName}`;
            let data = await ResourceManager.Instance.loadAsync<BufferAsset>(path);
            if (data) {
                let buffer = data.buffer();
                let bin = new Uint8Array(buffer.slice(0, buffer.byteLength));
                TableManager.dataMap.set(path, bin);
            } else {
                console.error("静态配置加载失败" + path);
            }
        }
        TableManager.tables = new Tables(this.getFileData);
        console.log("静态配置加载完成");
    }
    private getFileData(fileName: string): ByteBuf
    {
        let path = `excel_gen/${fileName}`;
        if (TableManager.dataMap.has(path)) {
            return new ByteBuf(TableManager.dataMap.get(path));
        }
        return null;
    }
}
