
export class Attribute {
    public base: number;
    public current: number;
    constructor(base: number, current: number) {
        this.base = base;
        this.current = current;
    }
    public onCheckCurrentChange = (oldCurrent: number, newCurrent: number) => newCurrent;
    public onPostCurrentChange = (oldCurrent: number, newCurrent: number) => {};
}