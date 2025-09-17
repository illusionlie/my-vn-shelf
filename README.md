# 个人视觉小说评分榜

这是一个使用原生 HTML, CSS, 和 JavaScript 构建、无依赖的现代化、响应式的个人视觉小说（VN）评分榜网页。

## 特性

- **动态数据加载**: 所有 VN 数据从 `main.json` 文件动态加载，方便添加和管理。
- **现代化设计**: 采用类似 Apple 设计风格的 UI，包含毛玻璃效果、平滑动画和优雅的排版。
- **响应式布局**: 在桌面、平板和手机设备上均有良好显示效果。
- **交互功能**:
  - **实时搜索**: 根据游戏名（译文/原文）快速过滤列表。
  - **分类筛选**: 可折叠的分类抽屉，支持按标签筛选。
  - **交互式弹窗**: 点击评分和简评可弹出显示详细信息的美观模态窗口。
- **高度可定制**:
  - **背景**: 在 `style.css` 中轻松更换背景图片。
  - **数据**: 在 `main.json` 中添加或修改你的 VN 收藏。
  - **Banner**: 在 `index.html` 中修改顶部 Banner 的标题和链接。

## 文件结构

```text
/personal-vn-reviews
|-- index.html         # 网页主结构
|-- main.json          # 视觉小说数据源
|-- images/            # 存放封面图片
    |-- thumbnails/    # 封面缩略图
|-- css/               # 样式文件
    |-- style.css      # 样式与布局
|-- js/                # JavaScript 文件
    |-- main.js        # 交互逻辑与数据渲染
|-- README.md          # 项目说明
```

## 如何使用

1. **克隆或下载项目**
2. **准备数据**:
    - 将你的 VN 封面图片（推荐垂直长图）放入 `images/` 文件夹，并在 `thumbnails/` 文件夹中提供一个缩略图。
    - 打开 `main.json` 文件。
    - 仿照现有格式添加你的 VN 数据。确保每个条目都有唯一的 `id`，并正确填写图片名称 (`cover_image`) 并确保两张图片名称一致。
3. **本地运行**:
    - 由于项目使用了 `fetch` API 来加载本地 JSON 文件，直接在浏览器中打开 `index.html` 可能会遇到 CORS 策略限制。
    - 推荐使用一个简单的本地服务器来预览。如果你安装了 VS Code，可以使用 "Live Server" 扩展。如果你安装了 Python，可以在项目根目录运行 `python -m http.server`。
4. **自定义**:
    - **背景**: 修改 `style.css` 中 `body` 的 `background-image` URL。
    - **颜色和字体**: 修改 `style.css` 文件顶部的 `:root` CSS 变量。

## main.json 规范

```json
[
  {
    "id": 1,                      # 唯一 ID
    "title_translated": "",       # 译文标题
    "title_original": "",         # 原文标题
    "company": "",                # 制作公司
    "cover_image": "",            # 封面图片文件名，缩略图文件名一致
    "vndb_url": "",               # VNDB 链接，可选
    "tags": ["Tag1", "Tag2"],     # 标签，用于分类筛选
    "all_ages": true,             # 是否为全年龄向，可选
    "time_length": 1,             # 游玩时长，单位为小时
    "rating_overall": 10.0,       # 综合评分
    "rating_details": {
      "剧情": 7,                  # 可自行添加详细评分
      "画风CG": 8,
    },
    "review_short": "",           # 简评，不支持换行符和 HTML 标签
    "review_full": ""             # 详细评价，可选
  }
]
```

## 许可证

采用 MIT 许可证。

---

Made with ❤️ by IllusionLie
