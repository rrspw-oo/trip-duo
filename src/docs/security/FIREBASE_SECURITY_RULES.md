# Firebase Realtime Database 

## 

1.  [Firebase Console](https://console.firebase.google.com/)
2.  `travel-fd`
3.  **Realtime Database**
4.  **Rules** 
5. 
6.  **Publish** 

## 

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

## 

### travelPlans
- ****: 
- ****: 
- ****:  `ownerUid`  `users` 

### invites
- ****: 
- ****: 

### users
- ****: 
- ****: 

## 

 Firebase Console  **Rules**  **Simulator** 

###  1: 
```
Location: /travelPlans/user123
Auth: user123
Read:  
```

###  2: 
```
Location: /travelPlans/user456
Auth: user123
Read:  
```

###  3: 
```
Location: /travelPlans/user123
Auth: user456 (users array includes user456)
Read:  
```

## 

 ****
- 
- 
- 

## 

```
Firebase Realtime Database:
 travelPlans/
    {userId}/
        ownerUid: "userId"
        users: ["userId", "partnerId"]
        startDate: "2025-10-01"
        endDate: "2025-10-10"
        totalDays: 10
        flights: {...}
        dailyPlans: {...}
        essentials: {...}
        createdAt: timestamp
 invites/
    {code}/
        planId: "userId"
        status: "pending"
        timestamp: timestamp
 users/
     {uid}/
         planId: "userId"
         joinedAt: timestamp
```

##  

****

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

 ****

### 
1.  Firebase Console → Realtime Database → Rules 
2.  "Publish"
3. 
4. ****

## 

**Q: **
A: 

**Q: **
A:  Firebase Console 

**Q:  PERMISSION_DENIED **
A: 
1. Firebase 
2. 
3. 
4.  Ctrl+Shift+R

**Q: **
A: ****
