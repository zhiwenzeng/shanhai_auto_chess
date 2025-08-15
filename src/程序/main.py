#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
山海经异兽自走棋 - 主程序
数值验证工具
"""

import json
import os
import random
import time
from typing import List, Dict, Any

class 异兽:
    """异兽类"""
    def __init__(self, 数据: Dict[str, Any]):
        self.id = 数据["id"]
        self.名称 = 数据["名称"]
        self.稀有度 = 数据["稀有度"]
        self.生命值 = 数据["生命值"]
        self.护盾值 = 数据["护盾值"]
        self.攻击力 = 数据["攻击力"]
        self.背景故事 = 数据["背景故事"]
        self.特殊能力 = 数据["特殊能力"]
        self.最大生命值 = 数据["生命值"]
    
    def 受到伤害(self, 伤害值: int) -> bool:
        """受到伤害，返回是否死亡"""
        if self.护盾值 > 0:
            if 伤害值 <= self.护盾值:
                self.护盾值 -= 伤害值
                return False
            else:
                伤害值 -= self.护盾值
                self.护盾值 = 0
        
        self.生命值 -= 伤害值
        if self.生命值 <= 0:
            self.生命值 = 0
            return True
        return False
    
    def 治疗(self, 治疗值: int):
        """治疗异兽"""
        self.生命值 = min(self.生命值 + 治疗值, self.最大生命值)
    
    def 添加护盾(self, 护盾值: int):
        """添加护盾"""
        self.护盾值 += 护盾值
    
    def 提升攻击力(self, 提升值: int):
        """提升攻击力"""
        self.攻击力 += 提升值
    
    def 显示状态(self) -> str:
        """显示异兽状态"""
        return f"{self.名称}({self.稀有度}) HP:{self.生命值}/{self.最大生命值} 护盾:{self.护盾值} 攻击:{self.攻击力}"

class 奇珍异宝:
    """奇珍异宝类"""
    def __init__(self, 数据: Dict[str, Any]):
        self.id = 数据["id"]
        self.名称 = 数据["名称"]
        self.类型 = 数据["类型"]
        self.稀有度 = 数据["稀有度"]
        self.效果 = 数据["效果"]
        self.描述 = 数据["描述"]
    
    def 使用(self, 目标异兽: 异兽):
        """使用奇珍异宝"""
        if self.效果.get("生命值", 0) > 0:
            目标异兽.治疗(self.效果["生命值"])
        if self.效果.get("护盾值", 0) > 0:
            目标异兽.添加护盾(self.效果["护盾值"])
        if self.效果.get("攻击力", 0) > 0:
            目标异兽.提升攻击力(self.效果["攻击力"])

class 随机事件:
    """随机事件类"""
    def __init__(self, 数据: Dict[str, Any]):
        self.id = 数据["id"]
        self.名称 = 数据["名称"]
        self.类型 = 数据["类型"]
        self.触发概率 = 数据["触发概率"]
        self.描述 = 数据["描述"]
        self.效果 = 数据["效果"]
    
    def 触发(self, 玩家异兽列表: List[异兽]) -> str:
        """触发随机事件"""
        结果 = f"【{self.名称}】{self.描述}\n"
        
        if self.效果["类型"] == "全体增益":
            for 异兽 in 玩家异兽列表:
                异兽.治疗(self.效果["生命值"])
                异兽.添加护盾(self.效果["护盾值"])
                异兽.提升攻击力(self.效果["攻击力"])
            结果 += f"所有异兽获得增益：生命+{self.效果['生命值']}, 护盾+{self.效果['护盾值']}, 攻击+{self.效果['攻击力']}"
        
        elif self.效果["类型"] == "全体减益":
            for 异兽 in 玩家异兽列表:
                异兽.受到伤害(-self.效果["生命值"])
                异兽.护盾值 = max(0, 异兽.护盾值 + self.效果["护盾值"])
                异兽.攻击力 = max(1, 异兽.攻击力 + self.效果["攻击力"])
            结果 += f"所有异兽受到减益：生命-{-self.效果['生命值']}, 护盾-{-self.效果['护盾值']}, 攻击-{-self.效果['攻击力']}"
        
        return 结果

class 商店:
    """商店类"""
    def __init__(self, 异兽列表: List[异兽], 奇珍异宝列表: List[奇珍异宝]):
        self.异兽列表 = 异兽列表
        self.奇珍异宝列表 = 奇珍异宝列表
        self.当前商品 = []
        self.冻结商品 = []
        self.刷新()
    
    def 刷新(self):
        """刷新商店"""
        self.当前商品 = []
        
        # 随机选择2-3个异兽
        异兽数量 = random.randint(2, 3)
        可用异兽 = [异兽 for 异兽 in self.异兽列表 if 异兽 not in self.冻结商品]
        if len(可用异兽) >= 异兽数量:
            self.当前商品.extend(random.sample(可用异兽, 异兽数量))
        
        # 随机选择1-2个奇珍异宝
        奇珍异宝数量 = 4 - len(self.当前商品)
        可用奇珍异宝 = [物品 for 物品 in self.奇珍异宝列表 if 物品 not in self.冻结商品]
        if len(可用奇珍异宝) >= 奇珍异宝数量:
            self.当前商品.extend(random.sample(可用奇珍异宝, 奇珍异宝数量))
    
    def 冻结商品(self, 商品索引: int):
        """冻结商品"""
        if 0 <= 商品索引 < len(self.当前商品):
            self.冻结商品.append(self.当前商品[商品索引])
            return True
        return False
    
    def 解冻商品(self, 商品索引: int):
        """解冻商品"""
        if 0 <= 商品索引 < len(self.冻结商品):
            self.冻结商品.pop(商品索引)
            return True
        return False
    
    def 显示商店(self) -> str:
        """显示商店内容"""
        显示 = "=== 商店 ===\n"
        for i, 商品 in enumerate(self.当前商品):
            if isinstance(商品, 异兽):
                显示 += f"{i+1}. [异兽] {商品.名称} - 3金币\n"
            else:
                显示 += f"{i+1}. [{商品.类型}] {商品.名称} - 2金币\n"
        
        if self.冻结商品:
            显示 += "\n=== 冻结商品 ===\n"
            for i, 商品 in enumerate(self.冻结商品):
                if isinstance(商品, 异兽):
                    显示 += f"F{i+1}. [异兽] {商品.名称} - 3金币\n"
                else:
                    显示 += f"F{i+1}. [{商品.类型}] {商品.名称} - 2金币\n"
        
        return 显示

class 游戏管理器:
    """游戏管理器"""
    def __init__(self):
        self.金币 = 10
        self.回合数 = 1
        self.玩家异兽列表 = []
        self.敌方异兽列表 = []
        self.商店 = None
        self.异兽列表 = []
        self.奇珍异宝列表 = []
        self.随机事件列表 = []
        self.加载配置()
        self.商店 = 商店(self.异兽列表, self.奇珍异宝列表)
    
    def 加载配置(self):
        """加载配置文件"""
        try:
            # 加载异兽配置
            with open("docs/数值配置/异兽配置.json", "r", encoding="utf-8") as f:
                异兽数据 = json.load(f)
                for 异兽数据 in 异兽数据["异兽列表"]:
                    self.异兽列表.append(异兽(异兽数据))
            
            # 加载奇珍异宝配置
            with open("docs/数值配置/奇珍异宝配置.json", "r", encoding="utf-8") as f:
                奇珍异宝数据 = json.load(f)
                for 食物数据 in 奇珍异宝数据["食物列表"]:
                    self.奇珍异宝列表.append(奇珍异宝(食物数据))
                for 道具数据 in 奇珍异宝数据["道具列表"]:
                    self.奇珍异宝列表.append(奇珍异宝(道具数据))
            
            # 加载随机事件配置
            with open("docs/数值配置/随机事件配置.json", "r", encoding="utf-8") as f:
                事件数据 = json.load(f)
                for 事件数据 in 事件数据["随机事件列表"]:
                    self.随机事件列表.append(随机事件(事件数据))
        
        except FileNotFoundError:
            print("配置文件未找到，使用默认配置")
            self.创建默认配置()
    
    def 创建默认配置(self):
        """创建默认配置"""
        # 创建一些默认异兽
        默认异兽数据 = {
            "id": "default_001",
            "名称": "测试异兽",
            "稀有度": "普通",
            "生命值": 5,
            "护盾值": 0,
            "攻击力": 3,
            "背景故事": "测试用异兽",
            "特殊能力": {
                "名称": "无",
                "描述": "无特殊能力",
                "触发阶段": "无"
            }
        }
        self.异兽列表.append(异兽(默认异兽数据))
    
    def 购买商品(self, 商品索引: int) -> str:
        """购买商品"""
        if 商品索引 < 0 or 商品索引 >= len(self.商店.当前商品):
            return "无效的商品索引"
        
        商品 = self.商店.当前商品[商品索引]
        价格 = 3 if isinstance(商品, 异兽) else 2
        
        if self.金币 < 价格:
            return f"金币不足，需要{价格}金币，当前只有{self.金币}金币"
        
        self.金币 -= 价格
        
        if isinstance(商品, 异兽):
            self.玩家异兽列表.append(商品)
            self.商店.当前商品.pop(商品索引)
            return f"成功购买异兽：{商品.名称}"
        else:
            # 使用奇珍异宝
            商品.使用(self.玩家异兽列表[0] if self.玩家异兽列表 else None)
            self.商店.当前商品.pop(商品索引)
            return f"成功使用{商品.类型}：{商品.名称}"
    
    def 刷新商店(self) -> str:
        """刷新商店"""
        if self.金币 < 1:
            return "金币不足，无法刷新商店"
        
        self.金币 -= 1
        self.商店.刷新()
        return "商店已刷新"
    
    def 冻结商品(self, 商品索引: int) -> str:
        """冻结商品"""
        if self.商店.冻结商品(商品索引):
            return "商品已冻结"
        return "冻结失败，无效的商品索引"
    
    def 解冻商品(self, 商品索引: int) -> str:
        """解冻商品"""
        if self.商店.解冻商品(商品索引):
            return "商品已解冻"
        return "解冻失败，无效的商品索引"
    
    def 随机事件触发(self) -> str:
        """触发随机事件"""
        for 事件 in self.随机事件列表:
            if random.random() < 事件.触发概率:
                return 事件.触发(self.玩家异兽列表)
        return "本回合没有随机事件"
    
    def 生成敌方阵容(self):
        """生成敌方阵容"""
        self.敌方异兽列表 = []
        敌方数量 = min(3, len(self.异兽列表))
        if 敌方数量 > 0:
            self.敌方异兽列表 = random.sample(self.异兽列表, 敌方数量)
    
    def 战斗(self) -> str:
        """战斗逻辑"""
        if not self.玩家异兽列表:
            return "玩家没有异兽，无法战斗"
        
        if not self.敌方异兽列表:
            self.生成敌方阵容()
        
        战斗日志 = f"=== 第{self.回合数}回合战斗 ===\n"
        回合数 = 1
        
        while self.玩家异兽列表 and self.敌方异兽列表:
            战斗日志 += f"\n--- 第{回合数}个回合 ---\n"
            
            # 玩家攻击
            for 玩家异兽 in self.玩家异兽列表[:]:
                if not self.敌方异兽列表:
                    break
                
                目标 = random.choice(self.敌方异兽列表)
                伤害 = 玩家异兽.攻击力
                目标.受到伤害(伤害)
                战斗日志 += f"{玩家异兽.名称} 攻击 {目标.名称}，造成{伤害}点伤害\n"
                
                if 目标.生命值 <= 0:
                    self.敌方异兽列表.remove(目标)
                    战斗日志 += f"{目标.名称} 被击败！\n"
            
            # 敌方攻击
            for 敌方异兽 in self.敌方异兽列表[:]:
                if not self.玩家异兽列表:
                    break
                
                目标 = random.choice(self.玩家异兽列表)
                伤害 = 敌方异兽.攻击力
                目标.受到伤害(伤害)
                战斗日志 += f"{敌方异兽.名称} 攻击 {目标.名称}，造成{伤害}点伤害\n"
                
                if 目标.生命值 <= 0:
                    self.玩家异兽列表.remove(目标)
                    战斗日志 += f"{目标.名称} 被击败！\n"
            
            回合数 += 1
        
        if self.玩家异兽列表:
            战斗日志 += f"\n战斗胜利！玩家剩余{len(self.玩家异兽列表)}只异兽"
        else:
            战斗日志 += f"\n战斗失败！所有异兽阵亡"
        
        return 战斗日志
    
    def 显示状态(self) -> str:
        """显示游戏状态"""
        状态 = f"=== 游戏状态 ===\n"
        状态 += f"回合：{self.回合数}\n"
        状态 += f"金币：{self.金币}\n"
        状态 += f"玩家异兽：{len(self.玩家异兽列表)}只\n"
        
        if self.玩家异兽列表:
            状态 += "\n玩家异兽详情：\n"
            for i, 异兽 in enumerate(self.玩家异兽列表):
                状态 += f"{i+1}. {异兽.显示状态()}\n"
        
        if self.敌方异兽列表:
            状态 += f"\n敌方异兽：{len(self.敌方异兽列表)}只\n"
            for i, 异兽 in enumerate(self.敌方异兽列表):
                状态 += f"{i+1}. {异兽.显示状态()}\n"
        
        return 状态
    
    def 执行GM指令(self, 指令: str) -> str:
        """执行GM指令"""
        指令 = 指令.strip().lower()
        
        if 指令.startswith("add_gold "):
            try:
                数量 = int(指令.split()[1])
                self.金币 += 数量
                return f"金币增加{数量}，当前金币：{self.金币}"
            except:
                return "指令格式错误：add_gold <数量>"
        
        elif 指令.startswith("set_gold "):
            try:
                数量 = int(指令.split()[1])
                self.金币 = 数量
                return f"金币设置为{数量}"
            except:
                return "指令格式错误：set_gold <数量>"
        
        elif 指令.startswith("heal_all "):
            try:
                治疗值 = int(指令.split()[1])
                for 异兽 in self.玩家异兽列表:
                    异兽.治疗(治疗值)
                return f"所有异兽治疗{治疗值}点生命值"
            except:
                return "指令格式错误：heal_all <治疗值>"
        
        elif 指令.startswith("buff_all "):
            try:
                攻击力 = int(指令.split()[1])
                for 异兽 in self.玩家异兽列表:
                    异兽.提升攻击力(攻击力)
                return f"所有异兽攻击力增加{攻击值}"
            except:
                return "指令格式错误：buff_all <攻击力>"
        
        elif 指令 == "clear_enemy":
            self.敌方异兽列表.clear()
            return "敌方异兽已清空"
        
        elif 指令 == "help":
            return """GM指令帮助：
add_gold <数量> - 增加金币
set_gold <数量> - 设置金币
heal_all <治疗值> - 治疗所有异兽
buff_all <攻击力> - 提升所有异兽攻击力
clear_enemy - 清空敌方异兽
help - 显示此帮助"""
        
        else:
            return "未知GM指令，输入 'help' 查看帮助"

def 清屏():
    """清屏"""
    os.system('cls' if os.name == 'nt' else 'clear')

def 显示主菜单():
    """显示主菜单"""
    print("""
╔══════════════════════════════════════════════════════════════╗
║                    山海经异兽自走棋                          ║
║                        数值验证工具                          ║
╠══════════════════════════════════════════════════════════════╣
║  1. 查看商店                                               ║
║  2. 购买商品                                               ║
║  3. 刷新商店                                               ║
║  4. 冻结/解冻商品                                          ║
║  5. 查看状态                                               ║
║  6. 开始战斗                                               ║
║  7. 随机事件                                               ║
║  8. GM指令                                                 ║
║  9. 下一回合                                               ║
║  0. 退出游戏                                               ║
╚══════════════════════════════════════════════════════════════╝
""")

def 主游戏循环():
    """主游戏循环"""
    游戏 = 游戏管理器()
    
    while True:
        清屏()
        显示主菜单()
        print(游戏.显示状态())
        print("\n" + "="*60)
        
        选择 = input("请选择操作 (0-9): ").strip()
        
        if 选择 == "0":
            print("感谢游玩！")
            break
        
        elif 选择 == "1":
            print("\n" + 游戏.商店.显示商店())
            input("按回车键继续...")
        
        elif 选择 == "2":
            print("\n" + 游戏.商店.显示商店())
            try:
                商品索引 = int(input("请输入要购买的商品编号 (1-4): ")) - 1
                结果 = 游戏.购买商品(商品索引)
                print(结果)
            except ValueError:
                print("请输入有效的数字")
            input("按回车键继续...")
        
        elif 选择 == "3":
            结果 = 游戏.刷新商店()
            print(结果)
            input("按回车键继续...")
        
        elif 选择 == "4":
            print("\n" + 游戏.商店.显示商店())
            try:
                操作 = input("选择操作 (f:冻结, u:解冻): ").strip().lower()
                if 操作 == "f":
                    商品索引 = int(input("请输入要冻结的商品编号 (1-4): ")) - 1
                    结果 = 游戏.冻结商品(商品索引)
                    print(结果)
                elif 操作 == "u":
                    商品索引 = int(input("请输入要解冻的商品编号 (1-冻结数量): ")) - 1
                    结果 = 游戏.解冻商品(商品索引)
                    print(结果)
                else:
                    print("无效操作")
            except ValueError:
                print("请输入有效的数字")
            input("按回车键继续...")
        
        elif 选择 == "5":
            print("\n" + 游戏.显示状态())
            input("按回车键继续...")
        
        elif 选择 == "6":
            战斗结果 = 游戏.战斗()
            print("\n" + 战斗结果)
            input("按回车键继续...")
        
        elif 选择 == "7":
            事件结果 = 游戏.随机事件触发()
            print("\n" + 事件结果)
            input("按回车键继续...")
        
        elif 选择 == "8":
            指令 = input("请输入GM指令: ").strip()
            结果 = 游戏.执行GM指令(指令)
            print(结果)
            input("按回车键继续...")
        
        elif 选择 == "9":
            游戏.回合数 += 1
            游戏.金币 = 10
            游戏.商店.刷新()
            print(f"进入第{游戏.回合数}回合，获得10金币")
            input("按回车键继续...")
        
        else:
            print("无效选择，请重新输入")
            input("按回车键继续...")

if __name__ == "__main__":
    print("欢迎来到山海经异兽自走棋！")
    print("这是一个数值验证工具，用于测试游戏平衡性。")
    input("按回车键开始游戏...")
    主游戏循环()
