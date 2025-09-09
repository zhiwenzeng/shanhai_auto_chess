// 保存当前活动文档和图层
var originalDoc = app.activeDocument;
var originalLayer = originalDoc.activeLayer;

// 获取文档原始尺寸和分辨率
var docWidth = originalDoc.width;
var docHeight = originalDoc.height;
var docResolution = originalDoc.resolution;

// 打开选择文件夹对话框
var folder = Folder.selectDialog("请选择保存文件的文件夹");

if (folder) {
    try {
        // 遍历所有图层（包括图层组）
        for (var i = 0; i < originalDoc.layers.length; i++) {
            var layer = originalDoc.layers[i];
            originalDoc.activeLayer = layer;
            
            // 记录原始位置
            var layerBounds = layer.bounds;
            var posX = layerBounds[0].as("px");
            var posY = layerBounds[1].as("px");
            
            // 复制图层内容
            layer.copy();
            
            // 创建匹配原始文档尺寸的临时文档
            var tempDoc = app.documents.add(
                docWidth, 
                docHeight, 
                docResolution, 
                "temp", 
                NewDocumentMode.RGB, 
                DocumentFill.TRANSPARENT
            );
            
            // 粘贴时保持原始位置（核心修正）
            tempDoc.paste();
            var pastedLayer = tempDoc.activeLayer;
            pastedLayer.translate(
                posX - pastedLayer.bounds[0].as("px"), 
                posY - pastedLayer.bounds[1].as("px")
            );
            
            // 保存设置
            var outputFile = new File(folder.fsName + "/" + layer.name + ".png");
            var pngOptions = new PNGSaveOptions();
            pngOptions.transparency = true;
            
            // 保存并关闭
            tempDoc.saveAs(outputFile, pngOptions, true);
            tempDoc.close(SaveOptions.DONOTSAVECHANGES);
        }
        
        // 恢复原始状态
        originalDoc.activeLayer = originalLayer;
        alert("成功导出 " + originalDoc.layers.length + " 个图层！");
    } catch(e) {
        alert("导出错误: " + e.message);
    }
} else {
    alert("操作已取消");
}