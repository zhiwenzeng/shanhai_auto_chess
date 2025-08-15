#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
山海经异兽自走棋 - 游戏启动脚本
"""

import os
import sys
import subprocess

def 检查Python版本():
    """检查Python版本是否满足要求"""
    if sys.version_info < (3, 7):
        print("错误：需要Python 3.7或更高版本")
        print(f"当前版本：{sys.version}")
        return False
    return True

def 检查配置文件():
    """检查配置文件是否存在"""
    配置文件路径 = "docs/数值配置/异兽配置.json"
    if not os.path.exists(配置文件路径):
        print("配置文件不存在，正在生成...")
        try:
            subprocess.run([sys.executable, "src/程序/配置生成器.py"], check=True)
            print("配置文件生成完成！")
        except subprocess.CalledProcessError:
            print("配置文件生成失败！")
            return False
    return True

def 启动游戏():
    """启动游戏"""
    print("正在启动山海经异兽自走棋...")
    try:
        subprocess.run([sys.executable, "src/程序/main.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"游戏启动失败：{e}")
        return False
    except KeyboardInterrupt:
        print("\n游戏已退出")
        return True
    return True

def 主函数():
    """主函数"""
    print("=" * 60)
    print("          山海经异兽自走棋 - 数值验证工具")
    print("=" * 60)
    
    # 检查Python版本
    if not 检查Python版本():
        input("按回车键退出...")
        return
    
    # 检查配置文件
    if not 检查配置文件():
        input("按回车键退出...")
        return
    
    # 启动游戏
    启动游戏()

if __name__ == "__main__":
    主函数()
