import SwiftUI

struct LedgerListView: View {
    @ObservedObject var ledger: Ledger
    @State private var clearingLedger = false

    var body: some View {
        NavigationStack {
            List {
                if ledger.expensesArray.isEmpty {
                    ContentUnavailableView("还没有账单", systemImage: "list.bullet.rectangle")
                } else {
                    ForEach(ledger.expensesArray) { expense in
                        ExpenseRow(expense: expense)
                            .swipeActions {
                                Button(role: .destructive) {
                                    delete(expense)
                                } label: {
                                    Label("删除", systemImage: "trash")
                                }
                            }
                    }
                }
            }
            .animation(.spring(response: 0.48, dampingFraction: 0.88), value: ledger.expensesArray.map(\.id))
            .navigationTitle("账单")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button(role: .destructive) {
                        clearingLedger = true
                    } label: {
                        Image(systemName: "trash")
                    }
                    .disabled(ledger.expensesArray.isEmpty)
                }
            }
            .confirmationDialog("确定清空全部账单吗？类别会保留。", isPresented: $clearingLedger, titleVisibility: .visible) {
                Button("清空账单", role: .destructive) {
                    clearLedger()
                }
            }
        }
    }

    private func delete(_ expense: Expense) {
        withAnimation(.spring(response: 0.45, dampingFraction: 0.84)) {
            expense.softDeleted = true
            expense.updatedAt = Date()
            ledger.updatedAt = Date()
            PersistenceController.shared.save()
        }
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
    }

    private func clearLedger() {
        withAnimation(.spring(response: 0.5, dampingFraction: 0.86)) {
            ledger.expensesArray.forEach {
                $0.softDeleted = true
                $0.updatedAt = Date()
            }
            ledger.updatedAt = Date()
            PersistenceController.shared.save()
        }
    }
}

struct ExpenseRow: View {
    @ObservedObject var expense: Expense

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(expense.categoryName)
                    .font(.headline)
                Spacer()
                Text(moneyText(expense.amountCents))
                    .font(.headline)
                    .contentTransition(.numericText())
            }

            HStack {
                Label(familyName(expense.payerId), systemImage: "person.2.fill")
                Spacer()
                Text(expense.date, style: .date)
            }
            .font(.subheadline)
            .foregroundStyle(.secondary)

            if let note = expense.note, !note.isEmpty {
                Text(note)
                    .font(.subheadline)
            }
        }
        .padding(.vertical, 4)
    }
}
