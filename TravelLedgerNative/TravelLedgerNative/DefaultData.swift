import SwiftUI

enum DefaultData {
    static let families: [Family] = [
        Family(id: "family-a", name: "乐家", color: .green),
        Family(id: "family-b", name: "祺家", color: .blue),
        Family(id: "family-c", name: "旦家", color: .pink)
    ]

    static let categories = ["交通", "住宿", "餐饮", "门票", "购物", "其他"]
}

struct Family: Identifiable, Hashable {
    let id: String
    let name: String
    let color: Color
}
