import { _decorator, Component, Node, v2, v3, Vec2, Vec3 } from 'cc';

class MathRandom {
    private seed: number;
    private a: number;
    private c: number;
    private m: number;

    // 线性同余生成器 (LCG) 参数
    constructor(seed) {
        this.seed = seed;
        this.a = 1664525;
        this.c = 1013904223;
        this.m = Math.pow(2, 32);
    }
    
    // 生成0-1之间的随机数
    random() {
        this.seed = (this.seed * this.a + this.c) % this.m;
        return this.seed / this.m;
    }
}

export class MathUtil {
    private static _mathRandom: MathRandom = new MathRandom(42);
    public static random() : number {
        return this._mathRandom.random();
    }
    // 生成min到max之间的随机整数 [min, max]
    public static randomInt(min: number, max: number) : number {
        return Math.floor(MathUtil.random() * (max - min + 1)) + min;
    }
    public static convertV2(v: Vec3) : Vec2 {
        return v2(v.x, v.y);
    }
    static convertV3(v: Vec2, z: number = 0): Vec3 {
        return v3(v.x, v.y, z);
    }
}