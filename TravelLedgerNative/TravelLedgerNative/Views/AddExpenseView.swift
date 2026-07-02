import SwiftUI

struct AddExpenseView: View {
    @Environment(\.managedObjectContext) private var context
    @FocusState private var amountFocused: Bool
    @ObservedObject var ledger: Ledger

    @State private var amountText = ""
    @State private var selectedPayerId = ""
    @State private var selectedCategory = DefaultData.categories[0]
    @State private var date = Date()
    @State private var note = ""
    @State private var showCategorySheet = false
    @State private var errorMessage: String?
    @State private var savePulse = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("金额")
                            .font(.headline)
                        HStack(alignment: .firstTextBaseline, spacing: 8) {
                            Text("¥")
                                .font(.largeTitle.weight(.semibold))
                            TextField("0.00", text: $amountText)
                                .keyboardType(.decimalPad)
                                .focused($amountFocused)
                                .font(.system(size: amountFocused ? 48 : 42, weight: .bold, design: .rounded))
                                .contentTransition(.numericText())
                        }
                        .scaleEffect(amountFocused ? 1.03 : 1)
                        .animation(.spring(response: 0.45, dampingFraction: 0.82), value: amountFocused)
                    }
                    .padding(.vertical, 6)
                }

                Section("付款家庭") {
                    Picker("付款家庭", selection: $selectedPayerId) {
                        Text("未选择").tag("")
                        ForEach(DefaultData.families) { family in
                            Text(family.name).tag(family.id)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section("账单信息") {
                    Picker("类别", selection: $selectedCategory) {
                        ForEach(ledger.categoriesArray) { category in
                            Text(category.name).tag(category.name)
                        }
                    }

                    Button {
                        showCategorySheet = true
                    } label: {
                        Label("新增类别", systemImage: "tag.badge.plus")
                    }

                    DatePicker("日期", selection: $date, displayedComponents: .date)

                    TextField("备注", text: $note)
                }

                if let errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundStyle(.red)
                    }
                }

                Section {
                    Button {
                        addExpense()
                    } label: {
                        Label("添加账单", systemImage: "checkmark.circle.fill")
                            .frame(maxWidth: .infinity)
                            .scaleEffect(savePulse ? 1.04 : 1)
                    }
                    .buttonStyle(.borderedProminent)
                }
            }
            .navigationTitle("记账")
            .sheet(isPresented: $showCategorySheet) {
                AddCategoryView(ledger: ledger) { categoryName in
                    selectedCategory = categoryName
                }
            }
            .onAppear {
                PersistenceController.shared.ensureDefaultCategories(in: ledger)
                selectedCategory = ledger.categoriesArray.first?.name ?? DefaultData.categories[0]
            }
        }
    }

    private func addExpense() {
        errorMessage = nil

        let normalizedAmount = amountText.replacingOccurrences(of: ",", with: ".")
        guard let amount = Decimal(string: normalizedAmount), amount > 0 else {
            errorMessage = "请输入大于 0 的有效金额。"
            amountFocused = true
            return
        }

        guard DefaultData.families.contains(where: { $0.id == selectedPayerId }) else {
            errorMessage = "请选择付款家庭。"
            return
        }

        let cents = NSDecimalNumber(decimal: amount * 100).rounding(accordingToBehavior: nil).int64Value
        let expense = Expense(context: context)
        expense.id = UUID()
        expense.amountCents = cents
        expense.payerId = selectedPayerId
        expense.categoryName = selectedCategory
        expense.note = note.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : note
        expense.date = date
        expense.createdAt = Date()
        expense.updatedAt = Date()
        expense.softDeleted = false
        expense.ledger = ledger
        ledger.updatedAt = Date()

        PersistenceController.shared.save()
        UINotificationFeedbackGenerator().notificationOccurred(.success)

        withAnimation(.spring(response: 0.35, dampingFraction: 0.72)) {
            savePulse = true
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.18) {
            withAnimation(.spring(response: 0.45, dampingFraction: 0.86)) {
                savePulse = false
            }
        }

        amountText = ""
        note = ""
        amountFocused = true
    }
}
