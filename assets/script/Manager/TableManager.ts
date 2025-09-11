import { _decorator } from "cc";
import { ASingleton } from "../ASingleton";
import { ResourceManager } from "./ResourceManager";
import { Tables } from "../ExcelGen/schema";
import ByteBuf from "../luban/ByteBuf";

const { ccclass, property } = _decorator;

@ccclass("TableManager")
export class TableManager extends ASingleton {
    
    public static get Instance(): TableManager {
        return this.getInstance(TableManager);
    }

    private _tables: Tables | null = null;

    protected onInitialize(): void {
        
    }

    /**
     * 加载所有表数据（resources/excel_gen 下）
     */
    public async loadAll(): Promise<void> {
        // 预先将所有需要的 .bytes 载入为 ByteBuf
        const names = Tables.getTableNames();
        const bufMap = new Map<string, ByteBuf>();
        for (const name of names) {
            const bytes = await this._loadBytesFromResources(name);
            bufMap.set(name, new ByteBuf(bytes));
        }
        // 构建 Tables，传入同步 loader
        this._tables = new Tables((file: string) => {
            const buf = bufMap.get(file);
            if (!buf) throw new Error(`找不到表数据: ${file}`);
            return buf;
        });
    }

    /** 获取 Tables 实例（需先调用 loadAll） */
    public get tables(): Tables {
        if (!this._tables) {
            throw new Error("Tables 尚未加载，请先调用 TableManager.loadAll()");
        }
        return this._tables;
    }

    /**
     * 从 resources/excel_gen 载入指定名字的二进制数据。
     * 会尝试无扩展名与 .bytes 两种路径。
     */
    private async _loadBytesFromResources(name: string): Promise<Uint8Array> {
        const base = `excel_gen/${name}`;
        // 先尝试无扩展名，再尝试 .bytes
        const candidates = [base, `${base}.bytes`];
        let asset: any = null;
        let lastErr: any = null;
        for (const path of candidates) {
            try {
                asset = await ResourceManager.Instance.loadAsync<any>(path);
                if (asset) {
                    const bytes = this._extractBytes(asset);
                    if (bytes) return bytes;
                }
            } catch (err) {
                lastErr = err;
                continue;
            }
        }
        throw new Error(`加载表数据失败: ${name} (${lastErr ?? '资源不存在'})`);
    }

    /**
     * 尝试从 Cocos 资源 Asset 对象提取 Uint8Array
     */
    private _extractBytes(asset: any): Uint8Array | null {
        // 常见导入：_nativeAsset 可能是 ArrayBuffer 或 Uint8Array
        const nat = asset && (asset._nativeAsset ?? asset.nativeAsset ?? asset.data);
        if (nat instanceof ArrayBuffer) return new Uint8Array(nat);
        if (nat instanceof Uint8Array) return nat;
        // 某些版本 TextAsset.text 为字符串，这里退化为 UTF-8 编码（不推荐，但作为兜底）
        const text = asset && (asset.text as string);
        if (typeof text === 'string') {
            try {
                return new TextEncoder().encode(text);
            } catch {}
        }
        return null;
    }
}
