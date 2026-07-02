# TravelLedgerNative

原生 SwiftUI 三家庭旅游记账 App。第一版使用 Core Data + CloudKit Sharing，为 iCloud 多人协同做准备。

## 打开方式

1. 用 Xcode 打开 `TravelLedgerNative.xcodeproj`。
2. 修改 Bundle Identifier、Team 和 iCloud container 为自己的 Apple Developer 账号下的值。
3. 在 Signing & Capabilities 中确认启用 iCloud、CloudKit、Background Modes / Remote notifications。
4. 使用模拟器测试本地功能；使用真机和两个不同 Apple ID 测试 iCloud Sharing。

## 当前功能

- 四个原生 Tab：记账、统计、账单、设置。
- 固定三家：乐家、祺家、旦家。
- 类别预设并支持新增。
- Core Data 本地保存。
- 总支出、各家已付、类别汇总、三家均摊和平账建议。
- 账单左滑删除、清空确认。
- iCloud 分享入口使用系统 `UICloudSharingController`。
