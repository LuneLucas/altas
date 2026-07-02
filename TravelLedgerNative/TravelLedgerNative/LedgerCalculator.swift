import Foundation

struct LedgerSummary {
    let totalCents: Int64
    let shareCents: Int64
    let paidByFamily: [String: Int64]
    let categoryTotals: [String: Int64]
    let settlements: [Settlement]
}

struct Settlement: Identifiable {
    let id = UUID()
    let fromFamilyId: String
    let toFamilyId: String
    let cents: Int64
}

enum LedgerCalculator {
    static func summarize(expenses: [Expense], categories: [ExpenseCategory]) -> LedgerSummary {
        var paidByFamily = Dictionary(uniqueKeysWithValues: DefaultData.families.map { ($0.id, Int64(0)) })
        var categoryTotals = Dictionary(uniqueKeysWithValues: categories.map { ($0.name, Int64(0)) })
        var totalCents: Int64 = 0

        for expense in expenses where !expense.softDeleted {
            totalCents += expense.amountCents
            paidByFamily[expense.payerId, default: 0] += expense.amountCents
            categoryTotals[expense.categoryName, default: 0] += expense.amountCents
        }

        let familyCount = Int64(DefaultData.families.count)
        let baseShare = totalCents / familyCount
        let remainder = totalCents % familyCount

        let balances = DefaultData.families.enumerated().map { index, family in
            let extraCent = Int64(index) < remainder ? Int64(1) : Int64(0)
            let share = baseShare + extraCent
            return Balance(familyId: family.id, cents: paidByFamily[family.id, default: 0] - share)
        }

        return LedgerSummary(
            totalCents: totalCents,
            shareCents: totalCents / familyCount,
            paidByFamily: paidByFamily,
            categoryTotals: categoryTotals,
            settlements: settle(balances)
        )
    }

    private static func settle(_ balances: [Balance]) -> [Settlement] {
        var debtors = balances
            .filter { $0.cents < 0 }
            .map { Balance(familyId: $0.familyId, cents: abs($0.cents)) }
            .sorted { $0.cents > $1.cents }
        var creditors = balances
            .filter { $0.cents > 0 }
            .sorted { $0.cents > $1.cents }
        var settlements: [Settlement] = []

        while let debtor = debtors.first, let creditor = creditors.first {
            let amount = min(debtor.cents, creditor.cents)
            settlements.append(Settlement(fromFamilyId: debtor.familyId, toFamilyId: creditor.familyId, cents: amount))

            debtors[0].cents -= amount
            creditors[0].cents -= amount

            if debtors[0].cents == 0 { debtors.removeFirst() }
            if creditors[0].cents == 0 { creditors.removeFirst() }
        }

        return settlements
    }
}

private struct Balance {
    let familyId: String
    var cents: Int64
}

func moneyText(_ cents: Int64) -> String {
    let formatter = NumberFormatter()
    formatter.numberStyle = .currency
    formatter.currencyCode = "CNY"
    formatter.locale = Locale(identifier: "zh_CN")
    formatter.minimumFractionDigits = 2
    formatter.maximumFractionDigits = 2
    return formatter.string(from: NSNumber(value: Double(cents) / 100)) ?? "¥0.00"
}

func familyName(_ familyId: String) -> String {
    DefaultData.families.first(where: { $0.id == familyId })?.name ?? "未知家庭"
}
