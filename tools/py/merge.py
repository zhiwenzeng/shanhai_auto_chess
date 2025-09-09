import os
import re
import math
import threading
import tkinter as tk
from tkinter import filedialog, messagebox
from PIL import Image, ImageTk

class Merge:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("序列帧动画工具")
        self.root.geometry("800x600")
        self.root.protocol("WM_DELETE_WINDOW", self.on_close)
        
        # 初始化变量
        self.images = []
        self.photo_images = []
        self.current_frame = 0
        self.playing = False
        self.folder_path = ""
        self.folder_name = ""
        self.lock = threading.Lock()
        
        # 创建界面
        self.create_widgets()
        
        # 动画定时器
        self.animation_id = None
        
        self.root.mainloop()
    
    def create_widgets(self):
        """创建界面组件"""
        # 顶部按钮区域
        btn_frame = tk.Frame(self.root)
        btn_frame.pack(pady=10, fill=tk.X)
        
        # === 修复1：使用lambda正确绑定命令 ===
        self.btn_open = tk.Button(btn_frame, text="选择文件夹", command=lambda: self.load_images())
        self.btn_open.pack(side=tk.LEFT, padx=5)
        
        self.btn_play = tk.Button(btn_frame, text="播放", command=lambda: self.toggle_play(), state=tk.DISABLED)
        self.btn_play.pack(side=tk.LEFT, padx=5)
        
        self.btn_save = tk.Button(btn_frame, text="保存图集", command=lambda: self.save_sprite_sheet(), state=tk.DISABLED)
        self.btn_save.pack(side=tk.LEFT, padx=5)
        
        # 帧率控制
        tk.Label(btn_frame, text="帧率:").pack(side=tk.LEFT, padx=(20, 5))
        self.fps_var = tk.StringVar(value="12")
        fps_entry = tk.Entry(btn_frame, textvariable=self.fps_var, width=5)
        fps_entry.pack(side=tk.LEFT)
        
        # 像素模式开关
        self.pixel_mode_var = tk.BooleanVar(value=True)
        pixel_mode_check = tk.Checkbutton(
            btn_frame, text="像素模式", 
            variable=self.pixel_mode_var,
            command=self.update_display
        )
        pixel_mode_check.pack(side=tk.LEFT, padx=20)
        
        # 预览区域
        preview_frame = tk.Frame(self.root, bg="#333")
        preview_frame.pack(pady=10, padx=10, fill=tk.BOTH, expand=True)
        
        self.canvas = tk.Canvas(preview_frame, bg="#333", highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        self.canvas.bind("<Configure>", self.on_canvas_resize)  # 添加画布大小变化监听
        
        # 状态栏
        self.status_var = tk.StringVar(value="就绪 | 排序模式: 自然排序")
        status_bar = tk.Label(self.root, textvariable=self.status_var, bd=1, relief=tk.SUNKEN, anchor=tk.W)
        status_bar.pack(side=tk.BOTTOM, fill=tk.X)
    
    def natural_sort_key(self, s):
        """自然排序键生成函数"""
        return [
            int(part) if part.isdigit() else part.lower()
            for part in re.split(r'(\d+)', s)
        ]
    
    def on_canvas_resize(self, event):
        """画布大小变化时重绘当前帧"""
        if self.images:
            self.show_current_frame()
    
    def load_images(self):
        """加载图片序列（使用线程避免阻塞）"""
        folder_path = filedialog.askdirectory(initialdir='/Users/pretty/pet-game/Assets')
        if not folder_path:
            return
        
        # === 修复2：使用线程避免阻塞主循环 ===
        threading.Thread(target=self._load_images_thread, args=(folder_path,), daemon=True).start()
    
    def _load_images_thread(self, folder_path):
        """图片加载线程"""
        try:
            # 禁用按钮防止重复操作
            self.btn_open.config(state=tk.DISABLED)
            self.status_var.set("正在加载图片...")
            
            # 获取文件夹名称
            self.folder_path = folder_path
            self.folder_name = os.path.basename(folder_path)
            
            # 清空现有图片
            with self.lock:
                self.images.clear()
                self.photo_images.clear()
            
            # 获取图片文件
            valid_exts = ('.png', '.jpg', '.jpeg', '.bmp', '.gif')
            file_list = []
            for fname in os.listdir(folder_path):
                if fname.lower().endswith(valid_exts):
                    file_list.append(fname)
            
            if not file_list:
                messagebox.showerror("错误", "未找到有效图片文件")
                return
            
            # 使用自然排序
            file_list.sort(key=self.natural_sort_key)
            
            # 加载图片并检查尺寸
            first_size = None
            loaded_images = []
            for i, fname in enumerate(file_list):
                img_path = os.path.join(folder_path, fname)
                try:
                    img = Image.open(img_path)
                    if first_size is None:
                        first_size = img.size
                    elif img.size != first_size:
                        messagebox.showerror("错误", f"图片尺寸不一致: {fname}")
                        return
                    
                    loaded_images.append(img)
                    # 更新进度
                    self.status_var.set(f"正在加载: {i+1}/{len(file_list)}")
                except Exception as e:
                    messagebox.showerror("加载错误", f"无法加载图片: {fname}\n{str(e)}")
            
            if not loaded_images:
                messagebox.showerror("错误", "未找到有效图片文件")
                return
            
            # 更新图片列表
            with self.lock:
                self.images = loaded_images
            
            # 更新状态
            self.status_var.set(
                f"已加载 {len(self.images)} 张图片 | 尺寸: {first_size[0]}x{first_size[1]} | "
                f"排序模式: 自然排序"
            )
            
            # 启用按钮
            self.btn_play.config(state=tk.NORMAL)
            self.btn_save.config(state=tk.NORMAL)
            self.btn_open.config(state=tk.NORMAL)
            
            # 显示第一帧
            self.current_frame = 0
            self.show_current_frame()
            
        except Exception as e:
            messagebox.showerror("错误", f"加载图片时出错: {str(e)}")
            self.btn_open.config(state=tk.NORMAL)
    
    def show_current_frame(self):
        """在画布上显示当前帧"""
        if not self.images:
            return
        
        self.canvas.delete("all")
        
        # 获取画布尺寸
        canvas_width = self.canvas.winfo_width()
        canvas_height = self.canvas.winfo_height()
        
        if canvas_width <= 1 or canvas_height <= 1:
            return
        
        # 获取当前帧
        img = self.images[self.current_frame]
        img_width, img_height = img.size
        
        # 计算缩放比例
        scale = min(canvas_width / img_width, canvas_height / img_height)
        new_width = int(img_width * scale)
        new_height = int(img_height * scale)
        
        # 计算位置
        x = (canvas_width - new_width) // 2
        y = (canvas_height - new_height) // 2
        
        # 使用NEAREST插值
        if self.pixel_mode_var.get():
            resized_img = img.resize((new_width, new_height), Image.NEAREST)
            mode_text = "最近邻插值"
        else:
            resized_img = img.resize((new_width, new_height), Image.LANCZOS)
            mode_text = "双三次插值"
        
        # 显示图片
        photo = ImageTk.PhotoImage(resized_img)
        self.canvas.create_image(x, y, image=photo, anchor=tk.NW)
        
        # === 修复3：正确保持图片引用 ===
        self.canvas.photo = photo  # 保持引用防止被垃圾回收
        
        # 显示帧信息
        self.canvas.create_text(10, 10, text=f"帧: {self.current_frame+1}/{len(self.images)}", 
                               anchor=tk.NW, fill="white", font=("Arial", 12))
        self.status_var.set(
            f"帧: {self.current_frame+1}/{len(self.images)} | "
            f"渲染模式: {mode_text}"
        )
    
    def update_display(self):
        """更新显示模式"""
        if self.images:
            self.show_current_frame()
    
    def toggle_play(self):
        """切换播放状态"""
        self.playing = not self.playing
        
        if self.playing:
            self.btn_play.config(text="暂停")
            self.play_animation()
        else:
            self.btn_play.config(text="播放")
            if self.animation_id:
                self.root.after_cancel(self.animation_id)
                self.animation_id = None
    
    def play_animation(self):
        """播放动画"""
        if not self.playing or not self.images:
            return
        
        # 前进到下一帧
        self.current_frame = (self.current_frame + 1) % len(self.images)
        self.show_current_frame()
        
        # 计算帧间隔（毫秒）
        try:
            fps = int(self.fps_var.get())
            fps = max(1, min(fps, 60))  # 限制在1-60fps
            interval = int(1000 / fps)
        except:
            interval = 83  # 默认12fps
        
        # 设置下一帧
        self.animation_id = self.root.after(interval, self.play_animation)
    
    def save_sprite_sheet(self):
        """保存精灵图集（使用线程避免阻塞）"""
        # === 修复4：异步保存避免界面冻结 ===
        threading.Thread(target=self._save_sprite_sheet_thread, daemon=True).start()
    
    def _save_sprite_sheet_thread(self):
        """图集保存线程"""
        if not self.images:
            return
        
        try:
            # 禁用按钮防止重复操作
            self.btn_save.config(state=tk.DISABLED)
            self.status_var.set("正在生成图集...")
            
            # 计算图集尺寸
            num_images = len(self.images)
            grid_size = math.ceil(math.sqrt(num_images))
            tile_width, tile_height = self.images[0].size
            
            # 创建新图集
            sheet_width = grid_size * tile_width
            sheet_height = grid_size * tile_height
            sprite_sheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
            
            # 拼接图片
            for i, img in enumerate(self.images):
                x = (i % grid_size) * tile_width
                y = (i // grid_size) * tile_height
                sprite_sheet.paste(img, (x, y))
                # 更新进度
                self.status_var.set(f"正在生成图集: {i+1}/{num_images}")
            
            # 保存文件
            save_path = filedialog.asksaveasfilename(
                initialfile=f"{self.folder_name}.png",
                defaultextension=".png",
                filetypes=[("PNG 图片", "*.png"), ("所有文件", "*.*")]
            )
            
            if save_path:
                sprite_sheet.save(save_path, "PNG", compress_level=0)
                self.status_var.set(f"图集已保存: {os.path.basename(save_path)}")
                messagebox.showinfo("保存成功", f"像素级图集已保存至:\n{save_path}")
        
        except Exception as e:
            messagebox.showerror("保存错误", f"保存图集时出错: {str(e)}")
        finally:
            self.btn_save.config(state=tk.NORMAL)
    
    def on_close(self):
        """关闭窗口时的清理"""
        if self.animation_id:
            self.root.after_cancel(self.animation_id)
        self.root.destroy()

if __name__ == "__main__":
    app = Merge()