import CoreData
import CloudKit

final class PersistenceController {
    static let shared = PersistenceController()
    static let preview = PersistenceController(inMemory: true)

    let container: NSPersistentCloudKitContainer

    private init(inMemory: Bool = false) {
        container = NSPersistentCloudKitContainer(name: "TravelLedger")

        guard let description = container.persistentStoreDescriptions.first else {
            fatalError("Missing persistent store description.")
        }

        if inMemory {
            description.url = URL(fileURLWithPath: "/dev/null")
        } else {
            description.cloudKitContainerOptions = NSPersistentCloudKitContainerOptions(
                containerIdentifier: "iCloud.com.lucas.TravelLedgerNative"
            )
        }

        description.setOption(true as NSNumber, forKey: NSPersistentHistoryTrackingKey)
        description.setOption(true as NSNumber, forKey: NSPersistentStoreRemoteChangeNotificationPostOptionKey)

        container.loadPersistentStores { _, error in
            if let error {
                fatalError("Core Data store failed to load: \(error.localizedDescription)")
            }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy
    }

    func save() {
        let context = container.viewContext
        guard context.hasChanges else { return }

        do {
            try context.save()
        } catch {
            assertionFailure("Failed to save context: \(error.localizedDescription)")
        }
    }

    func ensureDefaultLedger() -> Ledger {
        let context = container.viewContext
        let request = Ledger.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(keyPath: \Ledger.createdAt, ascending: true)]
        request.fetchLimit = 1

        if let ledger = try? context.fetch(request).first {
            ensureDefaultCategories(in: ledger)
            return ledger
        }

        let ledger = Ledger(context: context)
        ledger.id = UUID()
        ledger.name = "三家庭旅行账本"
        ledger.createdAt = Date()
        ledger.updatedAt = Date()

        DefaultData.categories.forEach { name in
            let category = ExpenseCategory(context: context)
            category.id = UUID()
            category.name = name
            category.createdAt = Date()
            category.ledger = ledger
        }

        save()
        return ledger
    }

    func ensureDefaultCategories(in ledger: Ledger) {
        let existing = Set((ledger.categoriesArray).map(\.name))
        DefaultData.categories
            .filter { !existing.contains($0) }
            .forEach { name in
                let category = ExpenseCategory(context: container.viewContext)
                category.id = UUID()
                category.name = name
                category.createdAt = Date()
                category.ledger = ledger
            }
        save()
    }

    func share(
        ledger: Ledger,
        completion: @escaping (Result<(CKShare, CKContainer), Error>) -> Void
    ) {
        container.share([ledger], to: nil) { _, share, container, error in
            if let error {
                completion(.failure(error))
                return
            }

            guard let share, let container else {
                completion(.failure(CloudSharingError.missingShare))
                return
            }

            share[CKShare.SystemFieldKey.title] = ledger.name as CKRecordValue
            share.publicPermission = .none
            completion(.success((share, container)))
        }
    }

    func acceptShare(metadata: CKShare.Metadata) {
        guard let store = container.persistentStoreCoordinator.persistentStores.first else { return }

        container.acceptShareInvitations(from: [metadata], into: store) { _, error in
            if let error {
                assertionFailure("Failed to accept CloudKit share: \(error.localizedDescription)")
            }
        }
    }
}

enum CloudSharingError: LocalizedError {
    case missingShare

    var errorDescription: String? {
        "无法创建 iCloud 共享。"
    }
}
