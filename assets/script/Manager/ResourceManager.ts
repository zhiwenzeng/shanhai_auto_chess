import { _decorator, Asset, assetManager, Component, Node, resources } from 'cc';
import { ASingleton } from '../ASingleton';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends ASingleton {
    public static get Instance(): ResourceManager {
        return this.getInstance(ResourceManager);
    }

    // 资源缓存
    private _cache: Map<string, Asset> = new Map();

    // 引用计数
    private _refCount: Map<string, number> = new Map();

    /**
     * 预加载资源（需手动释放）
     * @param paths 资源路径数组
     */
    public async preload(paths: string[]): Promise<void> {
        await Promise.all(paths.map(path => this.loadAsync(path)));
    }

    /**
     * 异步加载资源
     * @param path 资源路径
     * @returns Promise<T>
     */
    public async loadAsync<T extends Asset>(path: string): Promise<T> {
        if (this._cache.has(path)) {
            const count = this._refCount.get(path);
            this._refCount.set(path, count + 1);
            return this._cache.get(path) as T;
        }
        try {
            const asset = await new Promise<T>((resolve, reject) => {
                const callback = (err: Error, res: T) => {
                    if (err) return reject(err);
                    resolve(res);
                };
                resources.load(path, callback)
            });
            console.log("加载: " + path);
            this._cache.set(path, asset);
            this._refCount.set(path, 1);
            return asset;
        } catch (error) {
            console.error('资源加载失败:', path, error);
            throw error;
        }
    }

    /**
     * 同步获取已加载资源
     * @param path 资源路径
     * @returns Asset | null
     */
    public load<T extends Asset>(path: string): T | null {
        const asset = this._cache.get(path) as T || null;
        if (asset == null) {
            console.error('请先使用 loadAsync 加载', path, "资源");
        }
        return asset;
    }

    /**
     * 释放资源
     * @param path 资源路径
     */
    public release(path: string): void {
        if (!this._refCount.has(path)) return;
        const count = this._refCount.get(path)! - 1;
        this._refCount.set(path, count);
        if (count <= 0) {
            const asset = this._cache.get(path);
            if (asset) {
                assetManager.releaseAsset(asset);
                this._cache.delete(path);
                this._refCount.delete(path);
            }
        }
    }

    /**
     * 释放所有未使用的资源
     */
    public releaseUnused(): void {
        const unused = Array.from(this._refCount.entries())
            .filter(([_, count]) => count <= 0)
            .map(([path]) => path);
        unused.forEach(path => {
            const asset = this._cache.get(path);
            if (asset) {
                assetManager.releaseAsset(asset);
                this._cache.delete(path);
                this._refCount.delete(path);
            }
        });
    }
}