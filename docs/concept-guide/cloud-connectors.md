---
sidebar_position: 5
---

# Cloud Connectors

Cloud Connectors provide the flexibility to choose your own storage and metadata backends, enabling data synchronization and sharing across different platforms and devices, in whatever deployment environment you choose.

## Local-first

When you first start using Fireproof, you can simply add it to your application, start saving documents, and writing queries. Fireproof handles data storage, making it easy to access. This local-first development approach means you don’t need to configure service providers or deployments to get started. Just import the `use-fireproof` module and start coding features.

With purely local-first APIs, you can prototype most interactive use cases, like point-of-sale, collaborative inventory, theme park experience, etc. Building your app this way ensures that the main interactions don’t depend on any remote services.

Fireproof commits to local storage before returning operation results, and enqueues remote writes to be sent later. Local extensions to Fireproof like full text or vector indexing are super easy to write.

## Pluggable connectors

When you are ready to share your app, you’ll want to deploy it somewhere. With Fireproof, you can deploy it anywhere you want. Your choice won’t impact how frontend features use Fireproof, it just gives you choices in how you implement the rest of your app.

When you are ready to add collaboration or backup to your app’s data, you can choose a cloud connector or write your own. This concept guide covers the commonalities across all the cloud connectors, but you can read about the different connectors in the Installation section. Continue reading here to understand the overall picture and how you might connect a new backend.

The connectors ship as their own packages. Most are both metadata and storage connectors, but that’s not required. It’s possible to remix connectors and use one storage backend with another metadata backend. When the developer activates a connector, the ledger will start enqueuing all storage and metadata writes, as well as listening for remote metadata data updates and fetching the associated storage files.

## Metadata connector

The metadata connector handles realtime agreement about the current state of Fireproof ledgers. It is the first place a ledger reads to sync state from remote, and contains all the information required to load the ledger from scratch.

Every ledger update results in a new metadata state, which points to one or more files, where each file is a valid start point for loading a snapshot of the complete ledger. The purpose of supporting multiple start point files is to support concurrent updates, such as multiple devices sending updates that aren’t based on each other. In these cases the metadata connector will carry the updates in parallel, so that clients have the opportunity to deterministically merge the updates.

The metadata connector itself is a coarse-grained CRDT that ensures that new file writes are processed by at least one peer. A file pointer is only dropped from the metadata list when it is replaced by a descendent file. When a client merges a remote head it stores that head’s pointer(s) as the current parent, and when it updates the remote head it lists those pointers as the parent. The CRDT server will obsolete only the replaced pointers. This means updates that haven't been processed by any clients will remain listed in the CRDT head, providing fairness among both loquacious and reserved clients, as well as a well defined casual ordering to the resulting dataset. It also means merging a head with multiple pointers can happen on the client, which sends an updated CRDT head with one file pointer and multiple parents.

The metadata connector works in the context of a single ledger at a time, and by default it not only shares the ledger state, but also the ledger encryption key. This key is required for both reads and writes, so the security of your ledger depends on this key. By default Fireproof keeps the key in the browser’s local storage, and synchronizes alongside the CRDT file pointer. This accomplished the limited purpose of making the binary file storage backend opaque to outside readers, while making the ledger accessible to anyone who can access the metadata server. If a metadata header is leaked outside the intended group without additional controls, the attacker can use it to read the rest of the ledger. The first line of defense is controlling the key, but when required you can use any existing auth system to restrict access to the stored files.

## Storage connector

The storage connector is logically a key-value store, where the keys are string and the values are binary. Some host adapters may require base64 to persist binary as string. Because the keys are based on hashes of the file content, storage connectors can take advantage of verifiable addressing to enforce checksums in lieu of authorizing writers. When content hashes are verified on write, all ledgers in a given host can share a storage bucket without risk.

If you look at the existing storage connectors, you can see that they all implement something like a GET and PUT interface, where binary or string data is stored under a content addressed hash id. On the implementation side, there are data upload and download functions, which accept common parameters across all the connectors. This simplifies creating new connectors.

## Key pinning and rotation

Currently, the key is static for each ledger, chosen randomly when the ledger is created. When a client tries to sync a ledger that exists on both sides for the first time, it can see a “key mismatch” error. For now, the workaround is copying all documents from the old client ledger to a new one that starts as a fork of the remote. In a future version of Fireproof, we’ll make pinning to the first remote key seen a default behavior.

Today, the key is frozen for the duration of the ledger lifecycle, so you can accomplish rotation by creating a new ledger and copying all (or the relevant) data to the new key. You’ll want to name the ledger eg “deals-02-2023” or some other rotating identifier so clients know where to look for the new key.

<!-- Figures: Metadata Connector: A diagram showing how the metadata connector works.
Storage Connector: A diagram showing how the storage connector works.
Key Pinning and Rotation: A flowchart showing the process of key pinning and rotation. -->
