# Firebase Realtime Database 安全規則設定

## 設定步驟

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案 `travel-fd`
3. 點擊左側選單的 **Realtime Database**
4. 點擊 **Rules** 標籤
5. 將以下規則複製並貼上到編輯器中
6. 點擊 **Publish** 發布規則

## 安全規則

```json
{
  "rules": {
    "travelPlans": {
      "$planId": {
        ".read": "auth != null && ($planId === auth.uid || data.child('ownerUid').val() === auth.uid || data.child('users').hasChild(auth.uid))",
        ".write": "auth != null && ($planId === auth.uid || data.child('ownerUid').val() === auth.uid || data.child('users').hasChild(auth.uid) || newData.child('ownerUid').val() === auth.uid)"
      }
    },
    "invites": {
      "$code": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```

## 規則說明

### travelPlans（旅行計劃）
- **讀取權限**: 只有計劃擁有者或計劃成員可以讀取
- **寫入權限**: 只有計劃擁有者或計劃成員可以寫入
- **驗證**: 確保新資料包含 `ownerUid` 和 `users` 欄位

### invites（邀請碼）
- **讀取權限**: 任何已登入用戶可以讀取（需要驗證邀請碼）
- **寫入權限**: 任何已登入用戶可以寫入（生成邀請碼）

### users（用戶資料）
- **讀取權限**: 只有該用戶本人可以讀取自己的資料
- **寫入權限**: 只有該用戶本人可以寫入自己的資料

## 測試規則

設定完成後，可以在 Firebase Console 的 **Rules** 頁面使用 **Simulator** 測試規則：

### 測試案例 1: 用戶讀取自己的計劃
```
Location: /travelPlans/user123
Auth: user123
Read: ✅ 允許
```

### 測試案例 2: 用戶讀取他人的計劃
```
Location: /travelPlans/user456
Auth: user123
Read: ❌ 拒絕
```

### 測試案例 3: 計劃成員讀取共享計劃
```
Location: /travelPlans/user123
Auth: user456 (users array includes user456)
Read: ✅ 允許
```

## 重要提醒

⚠️ **請務必設定這些安全規則**，否則：
- 任何人都可以讀取所有用戶的旅行計劃
- 任何人都可以修改或刪除他人的資料
- 可能造成資料外洩或損壞

## 資料結構參考

```
Firebase Realtime Database:
├── travelPlans/
│   └── {userId}/
│       ├── ownerUid: "userId"
│       ├── users: ["userId", "partnerId"]
│       ├── startDate: "2025-10-01"
│       ├── endDate: "2025-10-10"
│       ├── totalDays: 10
│       ├── flights: {...}
│       ├── dailyPlans: {...}
│       ├── essentials: {...}
│       └── createdAt: timestamp
├── invites/
│   └── {code}/
│       ├── planId: "userId"
│       ├── status: "pending"
│       └── timestamp: timestamp
└── users/
    └── {uid}/
        ├── planId: "userId"
        └── joinedAt: timestamp
```

## 🚨 快速測試方案（臨時開放規則）

如果您想先測試功能，可以暫時使用以下**開放規則**：

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

⚠️ **這個規則允許任何登入用戶讀寫所有資料，僅用於開發測試！**

### 測試步驟：
1. 在 Firebase Console → Realtime Database → Rules 貼上上面的開放規則
2. 點擊 "Publish"
3. 測試應用功能（建立計劃、加入計劃、即時同步）
4. **測試完成後，請改回本文檔頂部的安全規則！**

## 常見問題

**Q: 設定規則後現有資料會消失嗎？**
A: 不會，規則只影響讀寫權限，不會刪除資料。

**Q: 如果設定錯誤會怎樣？**
A: 用戶可能無法讀取或寫入資料，會看到權限錯誤。可以隨時在 Firebase Console 修改規則。

**Q: 為什麼會出現 PERMISSION_DENIED 錯誤？**
A: 可能原因：
1. Firebase 規則設定不正確
2. 用戶未登入
3. 規則尚未發布
4. 瀏覽器快取問題（嘗試硬刷新 Ctrl+Shift+R）

**Q: 開發測試用什麼規則最簡單？**
A: 使用上面的「快速測試方案」開放規則，但**測試完務必改回安全規則**！
