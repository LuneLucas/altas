import SwiftUI
import CloudKit

struct SettingsView: View {
    @ObservedObject var ledger: Ledger
    @State private var sharingItem: CloudSharingItem?
    @State private var sharingError: String?

    var body: some View {
        NavigationStack {
            List {
                Section("iCloud 协同") {
                    Button {
                        prepareShare()
                    } label: {
                        Label("邀请家庭成员", systemImage: "person.2.badge.plus")
                    }

                    Text("使用系统 iCloud 分享邀请另外两家加入同一个账本。参与者接受邀请后可新增和删除账单。")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }

                Section("账本") {
                    LabeledContent("名称", value: ledger.name)
                    LabeledContent("家庭", value: "乐家、祺家、旦家")
                }

                if let sharingError {
                    Section {
                        Text(sharingError)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("设置")
            .sheet(item: $sharingItem) { item in
                CloudSharingView(share: item.share, container: item.container)
            }
        }
    }

    private func prepareShare() {
        sharingError = nil

        PersistenceController.shared.share(ledger: ledger) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let item):
                    sharingItem = CloudSharingItem(share: item.0, container: item.1)
                case .failure(let error):
                    sharingError = error.localizedDescription
                }
            }
        }
    }
}

struct CloudSharingItem: Identifiable {
    let id = UUID()
    let share: CKShare
    let container: CKContainer
}

struct CloudSharingView: UIViewControllerRepresentable {
    let share: CKShare
    let container: CKContainer

    func makeUIViewController(context: Context) -> UICloudSharingController {
        let controller = UICloudSharingController(share: share, container: container)
        controller.availablePermissions = [.allowReadWrite, .allowPrivate]
        return controller
    }

    func updateUIViewController(_ uiViewController: UICloudSharingController, context: Context) {}
}
