# InfiniDepth Interactive Magnifier - 场景切换功能

## 功能概述

这个交互式深度对比工具现在支持多场景切换功能，包括：

- ✨ 平滑的滑动切换动画
- 🔍 每个场景独立的放大镜交互功能
- 🎯 可自定义的方法标签
- 📊 支持无限数量的场景

## 如何添加新场景

### 1. 准备图片资源

为每个场景准备以下图片：
- 1张RGB图片
- 4张深度图（对应4种方法）

将图片放在 `images/pub/infinidepth/` 目录下。

### 2. 配置场景

编辑 `js/infinidepth/config.js` 文件，在 `scenes` 数组中添加新的场景对象：

```javascript
const InfiniDepthConfig = {
    scenes: [
        // 已有场景...
        
        // 添加新场景
        ,{
            name: '场景名称',  // 显示在导航栏的场景名
            rgbImage: 'images/pub/infinidepth/your_rgb_image.png',
            depthImages: [
                'images/pub/infinidepth/your_method1_depth.png',
                'images/pub/infinidepth/your_method2_depth.png',
                'images/pub/infinidepth/your_method3_depth.png',
                'images/pub/infinidepth/your_method4_depth.png'
            ],
            methodLabels: [
                'Depth Anything v2',
                'Metric3D v2',
                'DepthPro',
                'InfiniDepth (Ours)'
            ]
        }
    ],
    // ...其他配置
};
```

### 3. 场景配置说明

每个场景对象包含以下属性：

- **name** (string): 场景名称，显示在导航栏中
- **rgbImage** (string): RGB图片路径
- **depthImages** (array): 4张深度图的路径数组
- **methodLabels** (array): 4个方法的标签名称

## 使用示例

### 示例1：添加室内场景

```javascript
{
    name: 'Indoor Scene',
    rgbImage: 'images/pub/infinidepth/indoor_rgb.png',
    depthImages: [
        'images/pub/infinidepth/indoor_dav2.png',
        'images/pub/infinidepth/indoor_metric3d.png',
        'images/pub/infinidepth/indoor_depthpro.png',
        'images/pub/infinidepth/indoor_ours.png'
    ],
    methodLabels: [
        'Depth Anything v2',
        'Metric3D v2',
        'DepthPro',
        'InfiniDepth (Ours)'
    ]
}
```

### 示例2：添加户外场景

```javascript
{
    name: 'Outdoor Scene',
    rgbImage: 'images/pub/infinidepth/outdoor_rgb.png',
    depthImages: [
        'images/pub/infinidepth/outdoor_dav2.png',
        'images/pub/infinidepth/outdoor_metric3d.png',
        'images/pub/infinidepth/outdoor_depthpro.png',
        'images/pub/infinidepth/outdoor_ours.png'
    ],
    methodLabels: [
        'Depth Anything v2',
        'Metric3D v2',
        'DepthPro',
        'InfiniDepth (Ours)'
    ]
}
```

## 切换动画

系统提供了4种滑动动画：

- **slideOutLeft**: 向左滑出
- **slideOutRight**: 向右滑出
- **slideInLeft**: 从左滑入
- **slideInRight**: 从右滑入

点击 "Previous" 按钮时，当前场景向右滑出，新场景从左侧滑入。
点击 "Next" 按钮时，当前场景向左滑出，新场景从右侧滑入。

## 自定义配置

在 `config.js` 中可以调整以下参数：

```javascript
const InfiniDepthConfig = {
    // 场景配置
    scenes: [...],
    
    // 补丁大小设置
    initialPatchSize: 256,  // 初始补丁大小
    minPatchSize: 64,       // 最小补丁大小（最大放大）
    maxPatchSize: 512,      // 最大补丁大小（最小放大）
    
    // 缩放行为
    zoomStep: 0.1,          // 每次滚轮缩放的步长
    
    // 视觉设置
    lensColor: '#6b9ac4',   // 放大镜边框颜色
    lensOpacity: 0.15,      // 放大镜背景透明度
    
    // 切换动画
    transitionDuration: 500 // 切换动画持续时间（毫秒）
};
```

## 交互功能

每个场景都支持完整的放大镜交互功能：

1. **悬停显示放大镜**: 鼠标悬停在RGB图片上时显示圆形放大镜
2. **实时深度同步**: 放大镜位置的深度图同步显示在右侧4个canvas中
3. **滚轮缩放**: 使用鼠标滚轮调整查看区域大小（补丁大小）
4. **缩放信息显示**: 实时显示当前补丁大小和放大倍率

## 浏览器兼容性

- Chrome/Edge: ✅ 完全支持
- Firefox: ✅ 完全支持
- Safari: ✅ 完全支持
- 移动端: ✅ 支持触摸操作

## 注意事项

1. 确保所有图片路径正确且可访问
2. 深度图尺寸可以与RGB图不同，系统会自动进行坐标映射
3. 场景数组至少需要1个场景才能正常工作
4. 如果只有1个场景，Previous和Next按钮会自动禁用
5. 切换动画进行中时，会暂时禁用交互以确保动画流畅

## 故障排除

### 图片加载失败
- 检查图片路径是否正确
- 确认图片文件存在
- 查看浏览器控制台的错误信息

### 动画不流畅
- 尝试减小 `transitionDuration` 值
- 确保图片大小合理（建议 < 5MB）
- 检查是否有其他JavaScript错误

### 放大镜不显示
- 确认RGB图片已加载完成
- 检查CSS文件是否正确引入
- 确认JavaScript没有错误
