# SmartLamp - 智能闹钟与光照控制应用

<div align="center">

一款优雅的智能闹钟与光照控制应用，支持 iOS 和 Android 平台。

[功能特性](#功能特性) • [快速开始](#快速开始) • [技术栈](#技术栈) • [项目结构](#项目结构) • [API 文档](#api-文档)

</div>

---

## ✨ 功能特性

### 🔔 智能闹钟
- **多闹钟管理** - 支持创建和管理多个闹钟
- **灵活重复设置** - 按星期几自定义重复规则
- **渐进式铃声** - 音量渐强，温和唤醒
- **智能贪睡** - 可自定义贪睡时长
- **光照联动** - 闹钟触发时可联动灯光效果

### 💡 智能光照控制
- **亮度调节** - 0-100% 无级调光
- **色温调节** - 2000K-6500K 色温范围
- **场景模式** - 预设多种场景（日出、日光、日落、夜灯、阅读、放松）
- **自定义场景** - 创建并保存个人专属场景
- **日出日落模拟** - 自然光线变化模拟

### 🌙 睡眠监测
- **睡眠追踪** - 记录睡眠时长和质量
- **睡眠分析** - 深睡、浅睡、清醒时间统计
- **历史记录** - 查看历史睡眠数据
- **质量评分** - 智能评估睡眠质量

### 🎵 白噪音与助眠音乐
- **多种音效** - 白噪音、雨声、海浪、森林等
- **音量淡入淡出** - 平滑的音量过渡
- **循环播放** - 支持无限循环
- **后台播放** - 息屏后继续播放

### 🌤️ 天气集成
- **实时天气** - 显示当前温度、湿度、天气状况
- **日出日落时间** - 自动获取当地日出日落时间
- **智能建议** - 根据天气调整光照场景

### 🎨 优雅的用户界面
- **深色主题** - 护眼的深色界面设计
- **流畅动画** - 丰富的过渡动画和交互反馈
- **触觉反馈** - 支持震动反馈（可关闭）
- **渐变效果** - 精美的渐变色和光影效果
- **响应式设计** - 适配各种屏幕尺寸

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- Expo CLI
- iOS 模拟器（macOS）或 Android 模拟器

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd smart-lamp
```

2. **安装依赖**
```bash
# 安装根项目依赖
npm install

# 安装移动端依赖
cd mobile
npm install

# 安装后端依赖
cd ../backend
npm install
```

3. **配置环境变量**
```bash
# 在 backend 目录下创建 .env 文件
cd backend
cp .env.example .env
# 编辑 .env 文件，填入必要的配置
```

4. **启动后端服务**
```bash
cd backend
npm run dev
```

5. **启动移动应用**
```bash
cd mobile
npm start

# 或者直接运行
npm run ios     # iOS 模拟器
npm run android # Android 模拟器
```

---

## 🛠 技术栈

### 移动端
- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具集
- **TypeScript** - 类型安全
- **Zustand** - 轻量级状态管理
- **React Navigation** - 导航管理
- **React Native Reanimated** - 高性能动画
- **Expo Linear Gradient** - 渐变效果
- **Expo Notifications** - 通知管理
- **Expo AV** - 音频播放

### 后端
- **Node.js** - JavaScript 运行时
- **Express** - Web 框架
- **TypeScript** - 类型安全
- **Socket.io** - 实时通信
- **Node-cron** - 定时任务
- **Axios** - HTTP 客户端

### 开发工具
- **ESLint** - 代码规范
- **Prettier** - 代码格式化
- **ts-node-dev** - TypeScript 开发服务器

---

## 📁 项目结构

```
smart-lamp/
├── mobile/                 # React Native 移动应用
│   ├── src/
│   │   ├── components/    # UI 组件
│   │   │   ├── AlarmCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Slider.tsx
│   │   ├── screens/       # 页面组件
│   │   │   ├── AlarmsScreen.tsx
│   │   │   ├── LightControlScreen.tsx
│   │   │   ├── SleepScreen.tsx
│   │   │   ├── SettingsScreen.tsx
│   │   │   └── AddEditAlarmScreen.tsx
│   │   ├── navigation/    # 导航配置
│   │   │   ├── RootNavigator.tsx
│   │   │   └── BottomTabNavigator.tsx
│   │   ├── store/         # 状态管理
│   │   │   ├── useAlarmStore.ts
│   │   │   ├── useLightStore.ts
│   │   │   └── useSleepStore.ts
│   │   ├── services/      # 服务层
│   │   │   ├── notificationService.ts
│   │   │   ├── audioService.ts
│   │   │   └── weatherService.ts
│   │   ├── theme/         # 主题配置
│   │   │   ├── colors.ts
│   │   │   └── spacing.ts
│   │   ├── types/         # TypeScript 类型
│   │   │   └── index.ts
│   │   └── utils/         # 工具函数
│   │       └── helpers.ts
│   ├── assets/            # 静态资源
│   ├── App.tsx            # 应用入口
│   ├── app.json           # Expo 配置
│   └── package.json
│
├── backend/               # Node.js 后端服务
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   │   ├── alarmRoutes.ts
│   │   │   ├── lightRoutes.ts
│   │   │   ├── sleepRoutes.ts
│   │   │   └── weatherRoutes.ts
│   │   ├── services/     # 业务逻辑
│   │   │   └── scheduler.ts
│   │   └── server.ts     # 服务器入口
│   ├── .env.example      # 环境变量示例
│   ├── tsconfig.json     # TypeScript 配置
│   └── package.json
│
├── package.json          # 根项目配置
└── README.md             # 项目文档
```

---

## 📡 API 文档

### 闹钟 API

#### 获取所有闹钟
```http
GET /api/alarms
```

#### 创建闹钟
```http
POST /api/alarms
Content-Type: application/json

{
  "time": "07:00",
  "label": "早安闹钟",
  "enabled": true,
  "repeat": {
    "monday": true,
    "tuesday": true,
    "wednesday": true,
    "thursday": true,
    "friday": true,
    "saturday": false,
    "sunday": false
  },
  "sound": "default",
  "vibrate": true,
  "snooze": true,
  "snoozeDuration": 10,
  "gradualVolume": true,
  "lightEffect": true
}
```

#### 更新闹钟
```http
PUT /api/alarms/:id
Content-Type: application/json

{
  "time": "08:00",
  "enabled": false
}
```

#### 删除闹钟
```http
DELETE /api/alarms/:id
```

#### 切换闹钟开关
```http
POST /api/alarms/:id/toggle
```

### 光照控制 API

#### 获取灯光状态
```http
GET /api/lights
```

#### 更新灯光状态
```http
POST /api/lights/state
Content-Type: application/json

{
  "isOn": true,
  "brightness": 80,
  "colorTemperature": 4000
}
```

#### 切换灯光开关
```http
POST /api/lights/toggle
```

#### 设置亮度
```http
POST /api/lights/brightness
Content-Type: application/json

{
  "brightness": 75
}
```

#### 设置色温
```http
POST /api/lights/temperature
Content-Type: application/json

{
  "colorTemperature": 3500
}
```

#### 应用场景
```http
POST /api/lights/scene
Content-Type: application/json

{
  "scene": {
    "id": "sunrise",
    "name": "日出",
    "brightness": 30,
    "colorTemperature": 2700,
    "duration": 300
  }
}
```

### 睡眠监测 API

#### 获取所有睡眠记录
```http
GET /api/sleep
```

#### 创建睡眠记录
```http
POST /api/sleep
Content-Type: application/json

{
  "date": "2024-01-15",
  "startTime": "2024-01-15T23:00:00Z",
  "endTime": "2024-01-16T07:00:00Z",
  "duration": 480,
  "quality": 85,
  "deepSleep": 120,
  "lightSleep": 264,
  "awake": 96,
  "interruptions": 2
}
```

#### 获取睡眠统计
```http
GET /api/sleep/stats/summary?days=7
```

### 天气 API

#### 获取当前天气
```http
GET /api/weather?lat=39.9042&lon=116.4074
```

#### 获取日出日落时间
```http
GET /api/weather/sun?lat=39.9042&lon=116.4074
```

---

## 🎨 设计理念

SmartLamp 的设计遵循以下原则：

1. **简洁优雅** - 界面简洁，操作直观
2. **用户体验** - 流畅的动画和即时的反馈
3. **功能丰富** - 提供全面的智能家居控制功能
4. **性能优先** - 优化性能，保证流畅运行
5. **可扩展性** - 模块化设计，易于扩展新功能

---

## 🔧 开发指南

### 添加新功能

1. 在 `mobile/src/types/index.ts` 中定义类型
2. 在 `mobile/src/store/` 中创建状态管理
3. 在 `mobile/src/components/` 或 `mobile/src/screens/` 中创建 UI
4. 在 `backend/src/routes/` 中添加 API 路由

### 自定义主题

编辑 `mobile/src/theme/colors.ts` 和 `mobile/src/theme/spacing.ts` 文件来自定义应用主题。

### 添加新的音效

在 `mobile/src/services/audioService.ts` 的 `soundTracks` 数组中添加新的音频文件。

---

## 📱 应用截图

> 注: 添加应用截图到 `mobile/assets/screenshots/` 目录

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

SmartLamp Team

---

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！
