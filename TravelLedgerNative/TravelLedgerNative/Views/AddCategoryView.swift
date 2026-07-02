import SwiftUI

struct AddCategoryView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.managedObjectContext) private var context

    @ObservedObject var ledger: Ledger
    let onAdd: (String) -> Void

    @State private var name = ""

    var body: some View {
        NavigationStack {
            Form {
                TextField("类别名称", text: $name)
            }
            .navigationTitle("新增类别")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("完成") { addCategory() }
                        .disabled(name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    private func addCategory() {
        let categoryName = name.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !categoryName.isEmpty else { return }

        if !ledger.categoriesArray.contains(where: { $0.name == categoryName }) {
            let category = ExpenseCategory(context: context)
            category.id = UUID()
            category.name = categoryName
            category.createdAt = Date()
            category.ledger = ledger
            ledger.updatedAt = Date()
            PersistenceController.shared.save()
        }

        onAdd(categoryName)
        dismiss()
    }
}
