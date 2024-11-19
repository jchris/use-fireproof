---
sidebar_position: 3
---

# Storage, Sync and Sharing

Before we get into how Fireproof storage, sync and sharing work, it’s worth discussing their design goals.

Fireproof leverages encrypted, immutable files for storage, ensuring data safety and integrity across any storage provider. The system is built to handle eventual consistency, making it robust and expanding the range of suitable storage backends. The synchronization process is managed by the Fireproof metadata endpoint, which also handles encryption keys, ensuring secure and up-to-date data sharing across devices. Sharing is facilitated by the host environment, allowing for flexible access control based on the application's needs.

## Storage

Fireproof makes it safe and fast to use any storage provider. It uses encrypted files so you can connect to any storage provider without exposing your data. Fireproof’s files are immutable, which means they are written once and never changed. This makes Fireproof reliable even on eventually consistent infrastructure, expanding the set of acceptable storage backends even further.

The encrypted files are named and addressed by their cryptographic hash content identifier. This means that if the file passed content validation, it’s the one you requested, taking the guesswork out of data integrity. Speaking of guessing, good luck guessing Fireproof filenames and loading them without the encryption key. This makes it relatively safe to run Fireproof on open access buckets, lowering the risk of cloud operations snafus.

Each ledger transaction creates a new tiny file, with just the changed data blocks, usually on the order of a few kilobytes. The file is saved locally (to browser or system storage) and written in the background to the configured cloud storage. When another client connects to the ledger, it will start from the most recent file in cloud storage, and load older files as needed based on pointers within the first file. Since each file is immutable, it can be cached indefinitely, and the client can load the ledger from any point in time.

Read more about storage and compaction in [Scaling Fireproof](/docs/concept-guide/scaling-fireproof) section.

## Sync

How does the second device learn which is the most recent file? What if multiple devices propose transactions at the same time? That is the responsibility of the Fireproof metadata endpoint, which also manages the encryption keys used for storage.

The metadata connector is the primary source for a ledger to sync state from remote and contains all necessary information to load the ledger from scratch. The connector supports multiple start point files to handle concurrent updates, ensuring fairness among clients and a well-defined casual ordering to the resulting dataset. It operates in the context of a single ledger at a time, sharing not only the ledger state but also the encryption key. The security of your ledger heavily relies on this key, which is stored in the browser’s local storage and synchronized alongside the CRDT file pointers. Read more about the how the metadata connector works in the [Cloud Connectors section.](/docs/concept-guide/cloud-connectors)

Sync connections enable ledgers on both ends to share updates. Clients are designed to automatically merge these remote updates when they are connected. In scenarios where multiple devices or users are connected, they will all have access to the same shared data.

Optimal synchronization is achieved when the process is swift. Therefore, most connectors utilize a real-time data channel. While key-value storage can suffice, the most efficient connectors operate some form of cloud processing endpoint.

## Sharing

How does the ledger decide who can update the metadata? We leave it up to the host environment – this is one of the benefits of being embedded. What matters for sharing is that only the correct users can update the metadata endpoint. Each host environment has strengths, so you should choose the one that best fits your use case.

For instance, with the PartyKit connector, anyone who can access the host party can update the ledger, so your ledger access control can follow the application logic, and you can extend the Fireproof server with access control callbacks.

In the IPFS connector, ledger update access is delegated with [UCAN](https://ucan.xyz/), so users can share data with each other without a central server. Your app can have custom UCAN capabilities, and users can delegate more than just service access. In the Fireproof examples, we delegate access to to update [w3clock](https://github.com/web3-storage/w3clock), a CRDT clock that inspired the Fireproof metadata connector.

Fireproof shines when it is shared amongst a collaborative group. Because it is immutable you can also rollback to previous state, limiting the potential for damage, accidental or otherwise.

## Practical Applications

Practical applications of sync and sharing in Fireproof include interactive chat applications, business apps, and games.

### Chat Apps

In a chat application, Fireproof allows you to use a shared ledger for each group chat. Each user sends messages by writing documents. You can write a document with a “composing” state and a timestamp, and then update it with the user content when the message is sent, for a more real-time feel with pre-message bubbles. Each user would also have their own set of group chats synced among their devices with a per-user ledger. Additionally, Fireproof's immutable nature allows for a reliable message history, ensuring that past conversations are preserved accurately. The encryption feature also ensures that these conversations are secure and can only be accessed by authorized users.

### Business Apps

Business apps like collaborative word processing or data entry would use a ledger per sharable workspace in Fireproof. Each user is then given their own view into the set of workspaces. This allows for real-time collaboration and ensures that all users have access to the most recent version of the data. Furthermore, Fireproof's ability to handle concurrent updates makes it ideal for business applications where multiple users may be editing a document simultaneously. The system ensures fairness among clients and a well-defined casual ordering to the resulting dataset, preventing conflicts and maintaining data integrity.

### Gaming

Gaming can also benefit from Fireproof's sharing capabilities. Per-level asset delivery and sync, as well as on-demand file sync, allows you to sync a catalog of games and download only the played ones. Or sync levels on demand, and within the levels, lazy load shaders for different runtime environments. You can also use Fireproof to organize game rooms, sync player settings across devices, and manage leaderboards from edge functions.

In multiplayer games, Fireproof can be used to share game state in real-time. This allows all players to have the same view of the game world, ensuring a fair and consistent gaming experience. Fireproof's ability to handle concurrent updates is particularly useful in fast-paced games where multiple players may be interacting with the game world simultaneously.

For game developers, Fireproof's sharing capabilities can simplify the process of distributing updates and new content. By using Fireproof to manage game assets, developers can ensure that all players have access to the latest game content without requiring manual downloads or updates.

Finally, Fireproof's encryption features can be used to secure player data, providing an additional layer of protection for sensitive information such as player profiles, game progress, and in-game purchases.

<!-- Figures:
CAR File Structure: A diagram showing the structure of an opaque CAR file with encrypted blocks and hard-to-guess IDs.
Sync Process: A flowchart showing the process of event notification and key sync via a secure channel.
Sharing Model: A diagram showing how existing auth can manage multi-device and multi-user sharing. -->
