import SwiftUI

struct SummaryView: View {
    @ObservedObject var ledger: Ledger

    private var summary: LedgerSummary {
        LedgerCalculator.summarize(expenses: ledger.expensesArray, categories: ledger.categoriesArray)
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("总支出")
                            .font(.headline)
                        Text(moneyText(summary.totalCents))
                            .font(.system(.largeTitle, design: .rounded, weight: .bold))
                            .contentTransition(.numericText())
                        Text("三家均摊：\(moneyText(summary.shareCents)) / 家")
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 8)
                }

                Section("各家已付") {
                    ForEach(DefaultData.families) { family in
                        LabeledContent(family.name, value: moneyText(summary.paidByFamily[family.id, default: 0]))
                    }
                }

                Section("类别汇总") {
                    ForEach(ledger.categoriesArray) { category in
                        let cents = summary.categoryTotals[category.name, default: 0]
                        if cents > 0 {
                            LabeledContent(category.name, value: moneyText(cents))
                        }
                    }
                }

                Section("平账建议") {
                    if summary.settlements.isEmpty {
                        ContentUnavailableView("当前无需转账", systemImage: "checkmark.seal")
                    } else {
                        ForEach(summary.settlements) { settlement in
                            HStack {
                                Text("\(familyName(settlement.fromFamilyId)) 给 \(familyName(settlement.toFamilyId))")
                                Spacer()
                                Text(moneyText(settlement.cents))
                                    .fontWeight(.semibold)
                            }
                        }
                    }
                }
            }
            .animation(.spring(response: 0.5, dampingFraction: 0.86), value: summary.totalCents)
            .navigationTitle("统计")
        }
    }
}
