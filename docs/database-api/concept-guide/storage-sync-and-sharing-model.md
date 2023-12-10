---
sidebar_position: 3
---

<!-- Figures:
CAR File Structure: A diagram showing the structure of an opaque CAR file with encrypted blocks and hard-to-guess IDs.
Sync Process: A flowchart showing the process of event notification and key sync via a secure channel.
Sharing Model: A diagram showing how existing auth can manage multi-device and multi-user sharing. -->


# Storage, Sync and Sharing Model

Before we get into how Fireproof storage, sync and sharing work, it’s worth discussing their design goals.

## Storage

To accomplish the mission of making application data available anywhere, Fireproof uses encrypted files so you can connect to any storage provider without exposing your data. Fireproof’s files are immutable, which means they are written once and never changed. This makes Fireproof reliable even on eventually consistent infrastructure, expanding the set of acceptable storage backends even further.

The encrypted files are named and addressed by their cryptographic hash content identifier. This means that if the file passed content validation, it’s the one you requested, taking the guesswork out of data integrity. Speaking of guessing, good luck guessing Fireproof filenames and loading them without the encryption key. This makes it relatively safe to run Fireproof on open access buckets, lowering the risk of cloud operations snafus.

In a browser scenario, each database transaction creates a new tiny file. The file is saved locally and in the background, written to the configured cloud storage. When another browser wants to load the database, it will start from the most recent file in cloud storage, and load older files as needed based on pointers within the first file.

## Sync

How does the second device learn which is the most recent file? What if multiple devices propose transactions at the same time? That is the responsibility of the Fireproof metadata endpoint, which also manages the encryption keys used for storage. Read more about the metadata connector in the Cloud Connectors section.
Sync connections make the databases on both sides share updates, and clients will automatically merge remote updates when they are connected. If multiple devices or users are connected, they will all share the same data.
Sync is best when it’s fast, so most connectors use a real time data channel. You can get away with just key value storage, but the best connectors run some sort of cloud endpoint.

## Sharing

How does the database decide who can update the metadata? We leave it up to the host environment – this is one of the benefits of being embedded. For instance, with the PartyKit connector, anyone who can access the host party can update the database, and in the IPFS connector, database update access is delegated with UCAN. In any case, Fireproof shines when it is shared amongst a collaborative group. Because it is immutable you can also rollback to previous state, limiting the potential for damage.
