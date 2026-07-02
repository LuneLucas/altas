import CoreData

@objc(Ledger)
public final class Ledger: NSManagedObject {
    @NSManaged public var id: UUID
    @NSManaged public var name: String
    @NSManaged public var createdAt: Date
    @NSManaged public var updatedAt: Date
    @NSManaged public var expenses: Set<Expense>
    @NSManaged public var categories: Set<ExpenseCategory>
}

extension Ledger {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Ledger> {
        NSFetchRequest<Ledger>(entityName: "Ledger")
    }

    var expensesArray: [Expense] {
        expenses
            .filter { !$0.softDeleted }
            .sorted { $0.date > $1.date }
    }

    var categoriesArray: [ExpenseCategory] {
        categories.sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
    }
}

@objc(Expense)
public final class Expense: NSManagedObject {
    @NSManaged public var id: UUID
    @NSManaged public var amountCents: Int64
    @NSManaged public var payerId: String
    @NSManaged public var categoryName: String
    @NSManaged public var note: String?
    @NSManaged public var date: Date
    @NSManaged public var createdAt: Date
    @NSManaged public var updatedAt: Date
    @NSManaged public var softDeleted: Bool
    @NSManaged public var ledger: Ledger
}

extension Expense {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<Expense> {
        NSFetchRequest<Expense>(entityName: "Expense")
    }
}

extension Expense: Identifiable {}

@objc(ExpenseCategory)
public final class ExpenseCategory: NSManagedObject {
    @NSManaged public var id: UUID
    @NSManaged public var name: String
    @NSManaged public var createdAt: Date
    @NSManaged public var ledger: Ledger
}

extension ExpenseCategory {
    @nonobjc public class func fetchRequest() -> NSFetchRequest<ExpenseCategory> {
        NSFetchRequest<ExpenseCategory>(entityName: "ExpenseCategory")
    }
}

extension ExpenseCategory: Identifiable {}
