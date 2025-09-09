import tkinter as tk
from tkinter import filedialog, ttk, messagebox
from PIL import Image, ImageTk
import os
import threading
import time

class Flip:
    def __init__(self, root):
        self.root = root
        self.root.title("像素风格序列帧处理器")
        self.root.geometry("1000x700")
        
        # 创建主框架
        self.main_frame = ttk.Frame(root, padding=10)
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # 文件夹选择区域
        self.folder_frame = ttk.LabelFrame(self.main_frame, text="文件夹选择")
        self.folder_frame.pack(fill=tk.X, pady=5)
        
        self.folder_path = tk.StringVar()
        ttk.Entry(self.folder_frame, textvariable=self.folder_path, width=70).pack(
            side=tk.LEFT, padx=5, pady=5, fill=tk.X, expand=True)
        ttk.Button(
            self.folder_frame, text="浏览...", 
            command=self.select_folder
        ).pack(side=tk.RIGHT, padx=5, pady=5)
        
        # 预览控制区域
        self.control_frame = ttk.Frame(self.main_frame)
        self.control_frame.pack(fill=tk.X, pady=5)
        
        self.preview_btn = ttk.Button(
            self.control_frame, text="加载序列帧", 
            command=self.load_images, state=tk.DISABLED
        )
        self.preview_btn.pack(side=tk.LEFT, padx=5)
        
        self.prev_btn = ttk.Button(
            self.control_frame, text="上一帧", 
            command=self.prev_image, state=tk.DISABLED
        )
        self.prev_btn.pack(side=tk.LEFT, padx=5)
        
        self.next_btn = ttk.Button(
            self.control_frame, text="下一帧", 
            command=self.next_image, state=tk.DISABLED
        )
        self.next_btn.pack(side=tk.LEFT, padx=5)
        
        self.auto_play_var = tk.IntVar()
        ttk.Checkbutton(
            self.control_frame, text="自动播放", 
            variable=self.auto_play_var, command=self.toggle_auto_play
        ).pack(side=tk.LEFT, padx=10)
        
        # 帧率控制
        ttk.Label(self.control_frame, text="帧率 (fps):").pack(side=tk.LEFT, padx=(20, 0))
        self.fps_var = tk.StringVar(value="5")
        ttk.Combobox(
            self.control_frame, textvariable=self.fps_var,
            values=["1", "2", "5", "10", "15", "24", "30"], width=3
        ).pack(side=tk.LEFT)
        
        # 处理按钮
        self.process_btn = ttk.Button(
            self.control_frame, text="处理并保存", 
            command=self.process_images, state=tk.DISABLED
        )
        self.process_btn.pack(side=tk.RIGHT, padx=5)
        
        # 输出选项
        self.output_var = tk.StringVar(value="overwrite")
        ttk.Radiobutton(
            self.control_frame, text="覆盖原文件", 
            variable=self.output_var, value="overwrite"
        ).pack(side=tk.RIGHT, padx=10)
        ttk.Radiobutton(
            self.control_frame, text="保存到新文件夹", 
            variable=self.output_var, value="new_folder"
        ).pack(side=tk.RIGHT, padx=5)
        
        # 预览区域
        self.preview_frame = ttk.LabelFrame(self.main_frame, text="序列帧预览")
        self.preview_frame.pack(fill=tk.BOTH, expand=True, pady=5)
        
        # 创建画布框架
        self.canvas_frame = ttk.Frame(self.preview_frame)
        self.canvas_frame.pack(fill=tk.BOTH, expand=True)
        
        # 原始图像画布
        self.orig_canvas = tk.Canvas(self.canvas_frame, bg="#f0f0f0", width=400, height=400)
        self.orig_canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        ttk.Label(self.canvas_frame, text="原始图像").pack(side=tk.LEFT, anchor=tk.N)
        
        # 翻转图像画布
        self.flipped_canvas = tk.Canvas(self.canvas_frame, bg="#f0f0f0", width=400, height=400)
        self.flipped_canvas.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True, padx=10, pady=10)
        ttk.Label(self.canvas_frame, text="水平翻转后").pack(side=tk.RIGHT, anchor=tk.N)
        
        # 状态栏
        self.status_var = tk.StringVar(value="就绪")
        self.status_bar = ttk.Label(
            root, textvariable=self.status_var, 
            relief=tk.SUNKEN, anchor=tk.W
        )
        self.status_bar.pack(side=tk.BOTTOM, fill=tk.X)
        
        # 进度条
        self.progress_var = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(
            root, variable=self.progress_var, maximum=100
        )
        self.progress_bar.pack(side=tk.BOTTOM, fill=tk.X)
        self.progress_bar.pack_forget()  # 初始隐藏进度条
        
        # 初始化变量
        self.image_files = []
        self.current_index = 0
        self.auto_playing = False
        self.thumbnail_size = (400, 400)
        self.auto_play_thread = None
        
    def select_folder(self):
        """选择要处理的文件夹"""
        folder_selected = filedialog.askdirectory()
        if folder_selected:
            self.folder_path.set(folder_selected)
            self.preview_btn.config(state=tk.NORMAL)
            self.status_var.set(f"已选择文件夹: {folder_selected}")
    
    def load_images(self):
        """递归加载文件夹中的所有图像文件"""
        folder = self.folder_path.get()
        if not folder:
            messagebox.showerror("错误", "请先选择文件夹")
            return
        
        # 获取图像文件（递归）
        self.image_files = self.get_image_files_recursive(folder)
        if not self.image_files:
            messagebox.showinfo("信息", "该文件夹未找到图像文件")
            return
        
        self.status_var.set(f"找到 {len(self.image_files)} 张图像")
        
        # 启用控制按钮
        self.prev_btn.config(state=tk.NORMAL)
        self.next_btn.config(state=tk.NORMAL)
        self.process_btn.config(state=tk.NORMAL)
        
        # 显示第一张图片
        self.current_index = 0
        self.show_current_image()
    
    def get_image_files_recursive(self, directory):
        """递归获取文件夹中的所有图像文件"""
        image_extensions = ('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.tga', '.tif', '.tiff')
        image_files = []
        
        for root, _, files in os.walk(directory):
            for file in files:
                if file.lower().endswith(image_extensions):
                    image_files.append(os.path.join(root, file))
        
        # 按文件名排序
        try:
            image_files.sort(key=lambda x: int(''.join(filter(str.isdigit, os.path.basename(x)))))
        except:
            image_files.sort()
        
        return image_files
    
    def show_current_image(self):
        """显示当前索引的图片"""
        if not self.image_files or self.current_index >= len(self.image_files):
            return
        
        file_path = self.image_files[self.current_index]
        self.status_var.set(f"显示 {self.current_index+1}/{len(self.image_files)}: {os.path.basename(file_path)}")
        
        # 加载原始图像
        try:
            img = Image.open(file_path)
            img.thumbnail(self.thumbnail_size, Image.NEAREST)  # 使用最邻近算法
            
            # 创建水平翻转的图像
            # 兼容新旧Pillow版本
            try:
                # 尝试使用新版本的方式
                flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
            except AttributeError:
                # 如果新版本方法不可用，使用旧版本方法
                flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
            
            # 转换为Tkinter兼容格式
            orig_tk = ImageTk.PhotoImage(img)
            flipped_tk = ImageTk.PhotoImage(flipped_img)
            
            # 更新画布
            self.orig_canvas.delete("all")
            self.orig_canvas.create_image(
                self.orig_canvas.winfo_width() // 2, 
                self.orig_canvas.winfo_height() // 2,
                image=orig_tk
            )
            self.orig_canvas.image = orig_tk  # 保持引用
            
            self.flipped_canvas.delete("all")
            self.flipped_canvas.create_image(
                self.flipped_canvas.winfo_width() // 2, 
                self.flipped_canvas.winfo_height() // 2,
                image=flipped_tk
            )
            self.flipped_canvas.image = flipped_tk  # 保持引用
            
        except Exception as e:
            messagebox.showerror("错误", f"无法加载图片: {file_path}\n错误: {str(e)}")
    
    def prev_image(self):
        """显示上一张图片"""
        if self.image_files and self.current_index > 0:
            self.current_index -= 1
            self.show_current_image()
    
    def next_image(self):
        """显示下一张图片"""
        if self.image_files and self.current_index < len(self.image_files) - 1:
            self.current_index += 1
            self.show_current_image()
    
    def toggle_auto_play(self):
        """切换自动播放状态"""
        if self.auto_play_var.get() == 1:
            self.start_auto_play()
        else:
            self.stop_auto_play()
    
    def start_auto_play(self):
        """开始自动播放序列帧"""
        if not self.image_files or self.auto_playing:
            return
        
        self.auto_playing = True
        self.auto_play_thread = threading.Thread(target=self.auto_play_worker, daemon=True)
        self.auto_play_thread.start()
    
    def stop_auto_play(self):
        """停止自动播放"""
        self.auto_playing = False
    
    def auto_play_worker(self):
        """自动播放的工作线程"""
        try:
            fps = float(self.fps_var.get())
            delay = 1.0 / fps
        except:
            delay = 0.2  # 默认5fps
        
        while self.auto_playing and self.image_files:
            # 前进到下一帧
            self.root.after(0, self.next_image)
            
            # 如果到达最后一帧，回到第一帧
            if self.current_index >= len(self.image_files) - 1:
                self.root.after(0, lambda: setattr(self, 'current_index', 0))
            
            time.sleep(delay)
            
            # 检查是否应该继续播放
            if not self.auto_playing:
                break
    
    def process_images(self):
        """处理所有图像"""
        folder = self.folder_path.get()
        if not folder or not self.image_files:
            messagebox.showerror("错误", "请先选择文件夹并加载图像")
            return
        
        # 确认操作
        if not messagebox.askyesno("确认", f"确定要处理 {len(self.image_files)} 张图像吗？此操作可能需要一些时间。"):
            return
        
        # 创建输出文件夹（如果需要）
        output_folder = folder
        if self.output_var.get() == "new_folder":
            output_folder = os.path.join(folder, "flipped_images")
            os.makedirs(output_folder, exist_ok=True)
        
        # 在新线程中处理图像
        self.status_var.set("处理中，请稍候...")
        self.progress_var.set(0)
        self.progress_bar.pack(side=tk.BOTTOM, fill=tk.X)  # 显示进度条
        self.process_btn.config(state=tk.DISABLED)
        
        threading.Thread(
            target=self.process_image_files, 
            args=(self.image_files, output_folder), 
            daemon=True
        ).start()
    
    def process_image_files(self, file_paths, output_folder):
        """处理所有图像文件"""
        success_count = 0
        total = len(file_paths)
        
        for i, file_path in enumerate(file_paths):
            try:
                # 打开图像
                img = Image.open(file_path)
                
                # 创建水平翻转的图像（兼容新旧版本）
                try:
                    flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
                except AttributeError:
                    flipped_img = img.transpose(Image.FLIP_LEFT_RIGHT)
                
                # 确定输出路径
                filename = os.path.basename(file_path)
                
                # 如果选择新文件夹，保持原始目录结构
                if self.output_var.get() == "new_folder":
                    relative_path = os.path.relpath(os.path.dirname(file_path), self.folder_path.get())
                    output_dir = os.path.join(output_folder, relative_path)
                    os.makedirs(output_dir, exist_ok=True)
                    output_path = os.path.join(output_dir, filename)
                else:
                    output_path = file_path  # 覆盖原文件
                
                # 保存图像（保持原始格式）
                flipped_img.save(output_path, quality=100)
                success_count += 1
                
                # 更新进度
                progress = int((i + 1) / total * 100)
                self.root.after(0, lambda: self.progress_var.set(progress))
                self.root.after(0, lambda: self.status_var.set(
                    f"处理进度: {progress}% ({i+1}/{total})"
                ))
            except Exception as e:
                print(f"处理图像失败: {file_path}, 错误: {str(e)}")
        
        # 处理完成
        self.root.after(0, lambda: self.status_var.set(
            f"处理完成! 成功: {success_count}/{total} 张图像"
        ))
        self.root.after(0, lambda: self.process_btn.config(state=tk.NORMAL))
        self.root.after(0, lambda: self.progress_bar.pack_forget())
        self.root.after(0, lambda: messagebox.showinfo(
            "完成", 
            f"图像处理完成!\n成功: {success_count}/{total}\n输出到: {output_folder}"
        ))

if __name__ == "__main__":
    root = tk.Tk()
    app = Flip(root)
    root.mainloop()