#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
山海经异兽自走棋 - 配置文件验证脚本
检查所有配置文件的完整性和正确性
"""

import json
import os

def 验证异兽配置():
    """验证异兽配置文件"""
    print("=== 验证异兽配置 ===")
    
    try:
        with open("docs/数值配置/异兽配置.json", "r", encoding="utf-8") as f:
            异兽数据 = json.load(f)
        
        异兽列表 = 异兽数据.get("异兽列表", [])
        print(f"异兽总数: {len(异兽列表)}")
        
        if len(异兽列表) != 88:
            print(f"❌ 异兽数量不正确，期望88，实际{len(异兽列表)}")
            return False
        
        # 检查每个异兽的完整性
        for i, 异兽 in enumerate(异兽列表):
            必需字段 = ["id", "名称", "稀有度", "生命值", "护盾值", "攻击力", "背景故事", "特殊能力"]
            for 字段 in 必需字段:
                if 字段 not in 异兽:
                    print(f"❌ 异兽{i+1}缺少字段: {字段}")
                    return False
            
            # 检查特殊能力字段
            特殊能力 = 异兽.get("特殊能力", {})
            能力字段 = ["名称", "描述", "触发阶段"]
            for 字段 in 能力字段:
                if 字段 not in 特殊能力:
                    print(f"❌ 异兽{i+1}特殊能力缺少字段: {字段}")
                    return False
            
            # 检查数值合理性
            if 异兽["生命值"] <= 0 or 异兽["护盾值"] < 0 or 异兽["攻击力"] <= 0:
                print(f"❌ 异兽{i+1}数值不合理: 生命{异兽['生命值']}, 护盾{异兽['护盾值']}, 攻击{异兽['攻击力']}")
                return False
        
        print("✅ 异兽配置验证通过")
        return True
        
    except Exception as e:
        print(f"❌ 异兽配置验证失败: {e}")
        return False

def 验证奇珍异宝配置():
    """验证奇珍异宝配置文件"""
    print("\n=== 验证奇珍异宝配置 ===")
    
    try:
        with open("docs/数值配置/奇珍异宝配置.json", "r", encoding="utf-8") as f:
            奇珍异宝数据 = json.load(f)
        
        食物列表 = 奇珍异宝数据.get("食物列表", [])
        道具列表 = 奇珍异宝数据.get("道具列表", [])
        
        print(f"食物总数: {len(食物列表)}")
        print(f"道具总数: {len(道具列表)}")
        
        if len(食物列表) != 30:
            print(f"❌ 食物数量不正确，期望30，实际{len(食物列表)}")
            return False
        
        if len(道具列表) != 12:
            print(f"❌ 道具数量不正确，期望12，实际{len(道具列表)}")
            return False
        
        # 检查食物的完整性
        for i, 食物 in enumerate(食物列表):
            必需字段 = ["id", "名称", "类型", "稀有度", "效果", "描述"]
            for 字段 in 必需字段:
                if 字段 not in 食物:
                    print(f"❌ 食物{i+1}缺少字段: {字段}")
                    return False
            
            # 检查效果字段
            效果 = 食物.get("效果", {})
            效果字段 = ["生命值", "护盾值", "攻击力"]
            for 字段 in 效果字段:
                if 字段 not in 效果:
                    print(f"❌ 食物{i+1}效果缺少字段: {字段}")
                    return False
        
        # 检查道具的完整性
        for i, 道具 in enumerate(道具列表):
            必需字段 = ["id", "名称", "类型", "稀有度", "效果", "描述"]
            for 字段 in 必需字段:
                if 字段 not in 道具:
                    print(f"❌ 道具{i+1}缺少字段: {字段}")
                    return False
            
            # 检查效果字段
            效果 = 道具.get("效果", {})
            效果字段 = ["生命值", "护盾值", "攻击力"]
            for 字段 in 效果字段:
                if 字段 not in 效果:
                    print(f"❌ 道具{i+1}效果缺少字段: {字段}")
                    return False
        
        print("✅ 奇珍异宝配置验证通过")
        return True
        
    except Exception as e:
        print(f"❌ 奇珍异宝配置验证失败: {e}")
        return False

def 验证随机事件配置():
    """验证随机事件配置文件"""
    print("\n=== 验证随机事件配置 ===")
    
    try:
        with open("docs/数值配置/随机事件配置.json", "r", encoding="utf-8") as f:
            事件数据 = json.load(f)
        
        事件列表 = 事件数据.get("随机事件列表", [])
        print(f"随机事件总数: {len(事件列表)}")
        
        if len(事件列表) != 66:
            print(f"❌ 随机事件数量不正确，期望66，实际{len(事件列表)}")
            return False
        
        # 检查每个事件的完整性
        for i, 事件 in enumerate(事件列表):
            必需字段 = ["id", "名称", "类型", "触发概率", "描述", "效果"]
            for 字段 in 必需字段:
                if 字段 not in 事件:
                    print(f"❌ 事件{i+1}缺少字段: {字段}")
                    return False
            
            # 检查效果字段
            效果 = 事件.get("效果", {})
            效果字段 = ["类型", "生命值", "护盾值", "攻击力"]
            for 字段 in 效果字段:
                if 字段 not in 效果:
                    print(f"❌ 事件{i+1}效果缺少字段: {字段}")
                    return False
            
            # 检查触发概率
            概率 = 事件.get("触发概率", 0)
            if 概率 < 0 or 概率 > 1:
                print(f"❌ 事件{i+1}触发概率不合理: {概率}")
                return False
        
        print("✅ 随机事件配置验证通过")
        return True
        
    except Exception as e:
        print(f"❌ 随机事件配置验证失败: {e}")
        return False

def 验证数值平衡性():
    """验证数值的平衡性"""
    print("\n=== 验证数值平衡性 ===")
    
    try:
        # 加载异兽配置
        with open("docs/数值配置/异兽配置.json", "r", encoding="utf-8") as f:
            异兽数据 = json.load(f)
        
        异兽列表 = 异兽数据.get("异兽列表", [])
        
        # 统计稀有度分布
        稀有度统计 = {}
        for 异兽 in 异兽列表:
            稀有度 = 异兽.get("稀有度", "未知")
            稀有度统计[稀有度] = 稀有度统计.get(稀有度, 0) + 1
        
        print("异兽稀有度分布:")
        for 稀有度, 数量 in 稀有度统计.items():
            print(f"  {稀有度}: {数量}只")
        
        # 检查属性范围
        生命值范围 = [异兽["生命值"] for 异兽 in 异兽列表]
        护盾值范围 = [异兽["护盾值"] for 异兽 in 异兽列表]
        攻击力范围 = [异兽["攻击力"] for 异兽 in 异兽列表]
        
        print(f"\n属性范围:")
        print(f"  生命值: {min(生命值范围)} - {max(生命值范围)}")
        print(f"  护盾值: {min(护盾值范围)} - {max(护盾值范围)}")
        print(f"  攻击力: {min(攻击力范围)} - {max(攻击力范围)}")
        
        # 检查数值合理性
        if max(生命值范围) > 25:
            print("⚠️  生命值上限较高，可能影响游戏平衡")
        
        if max(护盾值范围) > 8:
            print("⚠️  护盾值上限较高，可能影响游戏平衡")
        
        if max(攻击力范围) > 15:
            print("⚠️  攻击力上限较高，可能影响游戏平衡")
        
        print("✅ 数值平衡性检查完成")
        return True
        
    except Exception as e:
        print(f"❌ 数值平衡性检查失败: {e}")
        return False

def 主验证():
    """主验证函数"""
    print("山海经异兽自走棋 - 配置文件验证")
    print("=" * 50)
    
    验证结果 = []
    
    验证结果.append(验证异兽配置())
    验证结果.append(验证奇珍异宝配置())
    验证结果.append(验证随机事件配置())
    验证结果.append(验证数值平衡性())
    
    print("\n" + "=" * 50)
    if all(验证结果):
        print("🎉 所有配置文件验证通过！")
        print("✅ 异兽配置: 88种")
        print("✅ 食物配置: 30种")
        print("✅ 道具配置: 12种")
        print("✅ 随机事件: 66种")
        print("\n游戏配置完整，可以开始游玩！")
    else:
        print("❌ 部分配置文件验证失败，请检查配置")
    
    return all(验证结果)

if __name__ == "__main__":
    主验证()
