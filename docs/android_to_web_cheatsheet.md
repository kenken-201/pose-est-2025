# 📱 Android (Compose) → 🌐 Web (React/Tailwind) チートシート

Android Jetpack Compose 開発者が `pose-est-front` の実装をスムーズに理解・記述するための対応表です。

## 🏗️ レイアウト (Layout Primitives)

HTML/Tailwind では `div` タグに `flex` などのクラスを当ててレイアウトを組みます。

| Compose        | React + Tailwind                  | 考え方                                     |
| :------------- | :-------------------------------- | :----------------------------------------- |
| **Column**     | `<div className="flex flex-col">` | 縦並びの Flexbox                           |
| **Row**        | `<div className="flex flex-row">` | 横並びの Flexbox                           |
| **Box**        | `<div className="relative">`      | 重ね合わせ (z-index) の基準点              |
| **LazyColumn** | `map()` + `overflow-y-auto`       | リストレンダリング + スクロール            |
| **Spacer**     | `gap-4` or `p-4` / `m-4`          | 親に `gap` を使うか、要素に margin/padding |

### Column (縦並び)

**Compose**

```kotlin
Column(
    modifier = Modifier.fillMaxSize(),
    verticalArrangement = Arrangement.Center, // 縦方向中央
    horizontalAlignment = Alignment.CenterHorizontally // 横方向中央
) { ... }
```

**Web**

```tsx
<div
  className="
    flex flex-col
    w-full h-full      {/* fillMaxSize */}
    justify-center     {/* verticalArrangement */}
    items-center       {/* horizontalAlignment */}
"
>
  {children}
</div>
```

_Note: Flexbox の主軸(Main Axis)と交差軸(Cross Axis)の関係に注意。`flex-col` の場合、`justify` が縦、`items` が横です。_

### Row (横並び)

**Compose**

```kotlin
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.SpaceBetween, // 両端配置
    verticalAlignment = Alignment.CenterVertically // 縦方向中央
) { ... }
```

**Web**

```tsx
<div
  className="
    flex flex-row
    w-full             {/* fillMaxWidth */}
    justify-between    {/* horizontalArrangement */}
    items-center       {/* verticalAlignment */}
"
>
  {children}
</div>
```

---

## 🎨 スタイリング (Modifiers)

Tailwind CSS はクラス名でスタイルを適用します。数値の `1` は `0.25rem (4px)` に相当します。

| Compose Modifier           | Tailwind Class   | 例 (Compose → Tailwind)                   |
| :------------------------- | :--------------- | :---------------------------------------- |
| **.padding(16.dp)**        | `p-4`            | `p-4` (16px), `px-4` (横), `py-4` (縦)    |
| **.padding(top = 8.dp)**   | `pt-2`           | `pt-2`, `pr-2`, `pb-2`, `pl-2`            |
| **.fillMaxWidth()**        | `w-full`         | `w-full`, `w-screen`                      |
| **.fillMaxHeight()**       | `h-full`         | `h-full`, `h-screen`                      |
| **.size(48.dp)**           | `w-12 h-12`      | `w-12`, `h-12`                            |
| **.background(Color.Red)** | `bg-red-500`     | `bg-blue-50`, `bg-gray-900`               |
| **.border(...)**           | `border`         | `border`, `border-gray-200`, `rounded-lg` |
| **.clickable { }**         | `cursor-pointer` | `onClick={...}` と併用                    |

### 色と文字 (Typography)

| Compose                              | Tailwind Class          |
| :----------------------------------- | :---------------------- |
| **MaterialTheme.typography.h1**      | `text-4xl font-bold`    |
| **MaterialTheme.typography.body1**   | `text-base`             |
| **MaterialTheme.typography.caption** | `text-sm text-gray-500` |
| **FontWeight.Bold**                  | `font-bold`             |
| **Color.Gray**                       | `text-gray-500`         |

---

---

## ⚛️ コンポーネント構造 (Component Structure)

React コンポーネントは「Propsを受け取りUIを返す関数」です。

| 概念                   | React (TSX)                        | Android (Kotlin)                  |
| :--------------------- | :--------------------------------- | :-------------------------------- |
| **コンポーネント定義** | `const Comp = (props) => { ... }`  | `@Composable fun Comp(...)`       |
| **引数 (Props)**       | `interface Props { name: string }` | `fun Comp(name: String)`          |
| **Slot (子供)**        | `props.children`                   | `content: @Composable () -> Unit` |
| **公開**               | `export const ...`                 | `public fun ...`                  |

### 基本形

**Web (React)**

```tsx
interface LayoutProps {
  children: ReactNode; // Slot
}

// 1. export = public
// 2. FC<Props> = 関数の型定義
// 3. ({ children }) = 引数の分解宣言 (Destructuring)
export const MainLayout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="p-4">
      {children} {/* Slot展開 */}
    </div>
  );
};
```

**Android (Compose)**

```kotlin
// 1. public
// 2. @Composable
@Composable
fun MainLayout(
    content: @Composable () -> Unit // Slot
) {
    Box(modifier = Modifier.padding(16.dp)) {
        content() // Slot展開
    }
}
```

---

## 🏗️ ロジックと UI の分離 (Container / Presentational)

`ProcessingContainer.tsx` のようなパターンは、Android の `Screen` と `Content` の分離と同じです。

### 1. Container (Screen)

状態管理とロジックを担当し、見た目は持たない（または薄いラッパー）。

```tsx
export const ProcessingContainer = () => {
  // ViewModel購読
  const { status } = useVideoStore();

  // 状態による画面分岐 (When式)
  if (status === 'IDLE') return <UploadDropzone />;
  if (status === 'ERROR') return <ErrorDisplay />;

  return <ProgressOverlay />;
};
```

### 2. Presentational (Content)

状態を持たず、親から渡された Props を表示するだけ。

```tsx
// Stateless Composable
export const UploadDropzone = ({ onFileSelect }) => {
  return <div onClick={onFileSelect}>...</div>;
};
```

---

## 🧩 状態管理 (State Management)

### ローカル状態 (remember)

**Compose**

```kotlin
var count by remember { mutableStateOf(0) }
Button(onClick = { count++ })
```

**React**

```tsx
const [count, setCount] = useState(0);
<button onClick={() => setCount(c => c + 1)} />;
```

### 副作用 (LaunchedEffect)

**Compose**

```kotlin
LaunchedEffect(key1) {
    // Suspend function call
}
```

**React**

```tsx
useEffect(() => {
  // Async function call
  return () => {
    /* onDispose */
  };
}, [key1]);
```

---

## 💡 よく使う Tailwind パターン集

`pose-est-front` で頻出する組み合わせです。スニペットとして登録推奨。

### 1. 中央揃えコンテナ (Box Alignment)

```tsx
<div className="flex items-center justify-center p-4">...</div>
```

### 2. カード (Card View)

```tsx
<div className="bg-white rounded-xl shadow-card p-6 border border-gray-100">...</div>
```

### 3. レスポンシブ (Responsive)

スマホで縦並び、PCで横並び。

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{/* md (768px) 以上で2列になる */}</div>
```

### 4. グラデーション背景

```tsx
<div className="bg-gradient-to-b from-gray-50 to-white">...</div>
```

---

## 📚 Resources

- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/) - クラス名に迷ったらここ
- [React Docs](https://react.dev/) - 最近の React はドキュメントが非常に優秀です
