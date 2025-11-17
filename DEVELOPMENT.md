# SmartLamp 开发指南

## 开发环境设置

### 必需工具

1. **Node.js** (v18+)
   ```bash
   # 检查版本
   node --version
   ```

2. **npm 或 yarn**
   ```bash
   npm --version
   # 或
   yarn --version
   ```

3. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

4. **移动开发环境**
   - iOS: Xcode (仅 macOS)
   - Android: Android Studio

### 初次设置

1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd smart-lamp
   ```

2. 安装依赖
   ```bash
   npm run install:all
   ```

3. 配置环境变量
   ```bash
   cp backend/.env.example backend/.env
   # 编辑 backend/.env 文件
   ```

## 项目架构

### 移动端架构

```
mobile/src/
├── components/     # 可复用的UI组件
├── screens/        # 页面级组件
├── navigation/     # 导航配置
├── store/          # Zustand状态管理
├── services/       # 服务层（API、通知等）
├── theme/          # 主题配置
├── types/          # TypeScript类型定义
└── utils/          # 工具函数
```

### 后端架构

```
backend/src/
├── routes/         # API路由
├── services/       # 业务逻辑
└── server.ts       # 入口文件
```

## 开发工作流

### 启动开发服务器

1. **启动后端**
   ```bash
   cd backend
   npm run dev
   ```
   后端将在 `http://localhost:3000` 运行

2. **启动移动端**
   ```bash
   cd mobile
   npm start
   ```

3. **在模拟器中运行**
   ```bash
   # iOS
   npm run ios

   # Android
   npm run android
   ```

### 调试

#### 移动端调试

1. **React Native Debugger**
   - 下载并安装 React Native Debugger
   - 在应用中按 `Cmd+D` (iOS) 或 `Cmd+M` (Android)
   - 选择 "Debug JS Remotely"

2. **Expo 开发工具**
   - 在终端查看日志
   - 使用 Expo DevTools 网页界面

3. **日志输出**
   ```typescript
   console.log('Debug info:', data);
   ```

#### 后端调试

1. **使用 ts-node-dev**
   ```bash
   npm run dev
   ```
   文件更改时自动重启

2. **API 测试**
   - 使用 Postman 或 Insomnia
   - 使用 curl 命令
   ```bash
   curl http://localhost:3000/api/alarms
   ```

## 代码规范

### TypeScript

- 所有新代码必须使用 TypeScript
- 定义清晰的接口和类型
- 避免使用 `any` 类型

```typescript
// 好的示例
interface AlarmProps {
  alarm: Alarm;
  onPress: () => void;
}

// 避免
const handlePress = (data: any) => { ... }
```

### React 组件

- 使用函数式组件
- 使用 React Hooks
- Props 解构

```typescript
// 推荐
export const AlarmCard: React.FC<AlarmCardProps> = ({
  alarm,
  onPress
}) => {
  // ...
};

// 避免
export const AlarmCard = (props) => {
  return <View>{props.alarm.time}</View>;
};
```

### 命名规范

- **组件**: PascalCase (`AlarmCard`, `Button`)
- **函数**: camelCase (`handlePress`, `formatTime`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)
- **文件**: 与导出内容一致
  - 组件文件: `AlarmCard.tsx`
  - 工具文件: `helpers.ts`
  - 类型文件: `index.ts`

### 样式

- 使用 StyleSheet.create()
- 保持样式靠近组件
- 使用主题变量

```typescript
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background
  }
});
```

## 状态管理

### Zustand Store

1. **创建 Store**
```typescript
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));
```

2. **使用 Store**
```typescript
const { count, increment } = useMyStore();
```

### 持久化

使用 AsyncStorage 持久化状态：

```typescript
const loadState = async () => {
  const stored = await AsyncStorage.getItem('key');
  if (stored) {
    set(JSON.parse(stored));
  }
};

const saveState = async () => {
  await AsyncStorage.setItem('key', JSON.stringify(get()));
};
```

## API 开发

### 添加新的 API 端点

1. 在 `backend/src/routes/` 创建路由文件
2. 定义路由处理函数
3. 在 `server.ts` 中注册路由

```typescript
// backend/src/routes/myRoutes.ts
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ data: 'Hello' });
});

export default router;

// backend/src/server.ts
import myRoutes from './routes/myRoutes';
app.use('/api/my-endpoint', myRoutes);
```

### 移动端 API 调用

```typescript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchData = async () => {
  const response = await axios.get(`${API_BASE_URL}/endpoint`);
  return response.data;
};
```

## 测试

### 单元测试 (TODO)

```typescript
// 使用 Jest
import { render } from '@testing-library/react-native';
import { AlarmCard } from './AlarmCard';

test('renders alarm time', () => {
  const { getByText } = render(<AlarmCard alarm={mockAlarm} />);
  expect(getByText('07:00')).toBeTruthy();
});
```

### E2E 测试 (TODO)

使用 Detox 进行端到端测试。

## 性能优化

### 避免不必要的重渲染

```typescript
// 使用 React.memo
export const AlarmCard = React.memo<AlarmCardProps>(({ alarm }) => {
  // ...
});

// 使用 useCallback
const handlePress = useCallback(() => {
  // ...
}, [dependencies]);

// 使用 useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 图片优化

```typescript
// 使用适当的图片格式和尺寸
<Image
  source={require('./image.png')}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
/>
```

### 列表优化

```typescript
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## 构建与发布

### 构建移动应用

#### iOS

```bash
cd mobile
eas build --platform ios
```

#### Android

```bash
cd mobile
eas build --platform android
```

### 构建后端

```bash
cd backend
npm run build
```

生成的文件在 `dist/` 目录。

### 部署

#### 后端部署

推荐使用：
- Heroku
- Railway
- DigitalOcean
- AWS EC2

#### 移动应用发布

- iOS: App Store Connect
- Android: Google Play Console

## 故障排除

### 常见问题

1. **Metro Bundler 错误**
   ```bash
   # 清除缓存
   cd mobile
   npm start -- --reset-cache
   ```

2. **iOS 构建失败**
   ```bash
   cd mobile/ios
   pod install
   ```

3. **Android 构建失败**
   ```bash
   cd mobile/android
   ./gradlew clean
   ```

4. **端口已被占用**
   ```bash
   # 查找并终止进程
   lsof -ti:3000 | xargs kill -9
   ```

## 资源

### 文档
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)

### 工具
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)
- [Flipper](https://fbflipper.com/)
- [Reactotron](https://github.com/infinitered/reactotron)

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### Commit 规范

使用语义化提交信息：

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 添加测试
chore: 构建/工具更新
```

示例：
```
feat: 添加日出模拟场景
fix: 修复闹钟重复设置bug
docs: 更新API文档
```

## 获取帮助

- 查看 [README.md](README.md)
- 查看 [FEATURES.md](FEATURES.md)
- 提交 Issue
- 联系团队

---

祝开发愉快！ 🚀
