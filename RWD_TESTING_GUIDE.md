# RWD Testing Guide
## 響應式設計測試指南

本指南說明如何在不同裝置上測試應用的響應式設計。

---

## 支援的裝置

### 📱 iPhone 12 Pro (390 x 844)
**Breakpoint**: ≤ 428px

#### 優化項目
- ✅ 移除多層外框，簡化視覺層級
- ✅ 調整間距系統（4-40px）
- ✅ 按鈕最小高度 44px（符合觸控標準）
- ✅ 輸入框最小高度 44px
- ✅ Tab 可橫向滾動
- ✅ 標題字體縮小為 30px
- ✅ 卡片內距減少為 14px
- ✅ 防止橫向溢出

#### 測試重點
1. **Tab 導航**
   - 主 Tab 應可左右滾動
   - 子 Tab（行前安排）應可滾動
   - 按鈕不應互相擠壓

2. **表單輸入**
   - 所有輸入框高度足夠（44px+）
   - 鍵盤彈出時不遮擋內容
   - 按鈕間距充足

3. **卡片顯示**
   - 購物清單卡片顯示完整
   - 行前必備卡片不重疊
   - 刪除按鈕易於點擊

4. **內容不溢出**
   - 無橫向捲軸
   - 長文字自動換行
   - 圖片自適應寬度

---

### 📱 iPad Mini (744 x 1133)
**Breakpoint**: 429px - 834px

#### 優化項目
- ✅ 調整間距系統（5-56px）
- ✅ 按鈕最小高度 48px
- ✅ 輸入框最小高度 48px
- ✅ Tab 可橫向滾動
- ✅ 卡片內距 26px
- ✅ 較大的觸控目標

#### 測試重點
1. **橫向佈局**
   - Tab 在橫向模式下顯示良好
   - 卡片在兩欄佈局下對齊

2. **觸控體驗**
   - 所有互動元素易於點擊
   - 按鈕間距充足不誤觸

3. **內容密度**
   - 利用較大螢幕空間
   - 保持舒適的閱讀間距

---

### 💻 Desktop (≥ 835px)
**Breakpoint**: ≥ 835px

#### 優化項目
- ✅ 完整的間距系統（6-96px）
- ✅ Tab 可換行顯示
- ✅ 懸停效果啟用
- ✅ 最大寬度 1400px

---

## Chrome DevTools 測試步驟

### 1. 開啟 DevTools
```
Mac: Cmd + Option + I
Windows: F12 或 Ctrl + Shift + I
```

### 2. 切換到裝置模式
```
Mac: Cmd + Shift + M
Windows: Ctrl + Shift + M
```

### 3. 選擇裝置
- **iPhone 12 Pro**: 390 x 844
- **iPad Mini**: 744 x 1133
- **iPad Air**: 820 x 1180
- **自訂**: 手動調整寬度測試

### 4. 測試方向
- 縱向（Portrait）
- 橫向（Landscape）

---

## 關鍵測試項目

### ✅ 必須通過的檢查點

#### 1. 無橫向捲軸
```css
* {
  max-width: 100%;
}
```
- 檢查所有頁面無橫向溢出
- 圖片自適應
- 長文字自動換行

#### 2. 觸控目標大小
```
最小尺寸: 44px x 44px (Apple HIG)
建議尺寸: 48px x 48px
```
- 按鈕
- Checkbox
- 刪除圖示
- Tab 按鈕

#### 3. 可讀性
```
手機最小字體: 15px
平板最小字體: 15px
桌面最小字體: 17px
```

#### 4. 間距舒適度
- 按鈕間距 ≥ 8px
- 卡片間距 ≥ 8px（手機）
- 表單欄位間距 ≥ 14px

#### 5. Tab 滾動
- 主 Tab 可左右滑動
- 子 Tab 可左右滑動
- 滾動流暢（-webkit-overflow-scrolling: touch）

---

## 瀏覽器支援

### 測試瀏覽器
- ✅ Chrome/Edge (推薦)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ⚠️ Safari < 14（部分 CSS 不支援）

### 測試功能
1. **觸控事件**
   - 點擊
   - 滑動
   - 長按

2. **鍵盤輸入**
   - 輸入框聚焦
   - 鍵盤彈出
   - 自動滾動到輸入框

3. **動畫效果**
   - Hover（桌面）
   - 過渡動畫
   - 載入動畫

---

## 已知問題與修復

### ❌ 問題：Tab 被擠壓
**修復**:
```css
.tabs-nav {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-btn {
  min-width: 110px;
  white-space: nowrap;
}
```

### ❌ 問題：按鈕太小難以點擊
**修復**:
```css
.btn {
  min-height: 44px;
  padding: var(--space-sm) var(--space-md);
}
```

### ❌ 問題：卡片外框太多
**修復**:
```css
.tab-content {
  background: transparent;
  padding: 0;
  box-shadow: none;
}
```

### ❌ 問題：內容橫向溢出
**修復**:
```css
* {
  max-width: 100%;
}

.item-header h3 {
  word-wrap: break-word;
  min-width: 0;
}
```

---

## 效能測試

### Lighthouse 測試
```bash
# 在 Chrome DevTools
1. 切換到 Lighthouse 面板
2. 選擇 Mobile
3. 勾選 Performance 和 Accessibility
4. 執行測試
```

**目標分數**:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90

---

## 測試清單

### 📋 iPhone 12 Pro 測試

#### 登入頁面
- [ ] 標題完整顯示
- [ ] Google 登入按鈕高度足夠
- [ ] 背景動畫流暢
- [ ] 無橫向捲軸

#### 主頁面
- [ ] Header 完整顯示
- [ ] Tab 可滾動
- [ ] 使用者資訊完整

#### 行前安排
- [ ] 子 Tab 可滾動
- [ ] 表單輸入框高度足夠
- [ ] 機票卡片顯示完整
- [ ] 住宿卡片顯示完整
- [ ] 行前必備清單正常

#### 每日規劃
- [ ] Day Accordion 可展開
- [ ] 子 Tab（每日計劃/想買清單）正常
- [ ] 想買清單卡片顯示完整
- [ ] Checkbox 易於點擊
- [ ] 刪除按鈕不誤觸

---

### 📋 iPad Mini 測試

#### 整體
- [ ] 利用較大空間
- [ ] 按鈕間距充足
- [ ] 觸控體驗良好

#### 橫向模式
- [ ] Tab 排列合理
- [ ] 內容不過於分散
- [ ] 保持可讀性

---

## 疑難排解

### Q: Tab 按鈕被擠壓
**A**: 檢查是否有 `min-width` 設定，確保 `overflow-x: auto`

### Q: 輸入框太小
**A**: 檢查 `min-height: 44px`，並確保 padding 足夠

### Q: 卡片重疊
**A**: 檢查 `margin-bottom` 和 `gap` 設定

### Q: 橫向捲軸出現
**A**: 檢查元素是否有 `max-width: 100%`

---

## 開發提示

### 使用 CSS 變數
```css
@media (max-width: 428px) {
  :root {
    --space-md: 14px; /* 縮小間距 */
  }
}
```

### 觸控裝置偵測
```css
@media (hover: none) and (pointer: coarse) {
  /* 觸控裝置專用樣式 */
  .btn {
    min-height: 44px;
  }
}
```

### 防止縮放
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

---

## 更新記錄

- **2025-10-11**: 完成 iPhone 12 Pro 和 iPad Mini RWD 優化
  - 簡化外框層級
  - 加強觸控目標大小
  - 優化 Tab 滾動
  - 防止內容溢出
  - 調整間距系統

---

*測試完成後，請在實際裝置上驗證，因為模擬器可能無法完全重現實際體驗。*
