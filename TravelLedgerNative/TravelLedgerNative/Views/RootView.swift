import SwiftUI

struct RootView: View {
    @Environment(\.managedObjectContext) private var context
    @State private var ledger: Ledger?

    var body: some View {
        Group {
            if let ledger {
                TabView {
                    AddExpenseView(ledger: ledger)
                        .tabItem {
                            Label("记账", systemImage: "plus.circle.fill")
                        }

                    SummaryView(ledger: ledger)
                        .tabItem {
                            Label("统计", systemImage: "chart.pie.fill")
                        }

                    LedgerListView(ledger: ledger)
                        .tabItem {
                            Label("账单", systemImage: "list.bullet.rectangle.fill")
                        }

                    SettingsView(ledger: ledger)
                        .tabItem {
                            Label("设置", systemImage: "gearshape.fill")
                        }
                }
            } else {
                ProgressView("正在准备账本")
            }
        }
        .task {
            ledger = PersistenceController.shared.ensureDefaultLedger()
        }
    }
}
