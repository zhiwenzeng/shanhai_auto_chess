export class Blackboard {
    private _data: Map<string, any> = new Map();
    public set<T>(key: string, value: T): void {
        this._data.set(key, value);
    }
    public get<T>(key: string): T | undefined {
        return this._data.get(key);
    }
    public has(key: string): boolean {
        return this._data.has(key);
    }
    public delete(key: string): boolean {
        return this._data.delete(key);
    }
}