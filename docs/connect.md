---
sidebar_position: 8
---
# Sharing and Sync

Fireproof's verifiable CRDTs make it ideal for multi-user applications involving mission-critical data. Because Fireproof's clocks are multi-device aware, and each operation corresponds to a snapshot that is archived by default, user collaboration is as simple and safe as sharing a link. This article will help you transform any app that uses Fireproof into a multi-user experience.

### Intelligent Defaults

For simplicity, Fireproof ships with a default storage provider, [web3.storage](https://web3.storage) — a web-first bridge to the IPFS ecosystem. By default Fireproof is configured to work with [user-owned storage accounts using UCAN](https://ucan.xyz), so application developers can ship without having to worry about the business implications of managing user data. Hiding these implementation details from your users is easy, either by using our S3 adapter instead, or [delegating your users the ability to write to your app's web3.storage account.](https://blog.web3.storage/posts/ucan-delegation-with-w3up)

Fireproof works with any cloud storage provider. Because encryption keys are managed separately from the data, you aren't giving control of your data to 3rd parties, you are just using the cloud as a place to store opaque bytes. Content addressing makes this fast and secure, so it doesn't matter much which cloud provider you choose. Fireproof database metadata consists of a pointer to the latest immutable database commit (CAR file) and its encryption key. Assuming your CAR data files are accessible you can keep Fireproof metadata in your existing authenticated session management, cloud provider, or pub/sub system.

### Built-in Sharing 👥

We know that getting data between your users is the second thing you'll want to do after you have a working app experience. Fireproof APIs allow you to connect databases among multiple users with just a few lines of code by forwarding simple tokens. Read on for an example.

## Easy Start

Assuming you already have a working app with data in Fireproof, you can connect your users to the cloud with just a few lines of code.

```js
import { fireproof } from 'use-fireproof'

const db = fireproof('myDbName')

const cx = db.connect()

cx.ready.then(() => {
  if (cx.authorized)  {
    // hide email input
  } else {
    // get email from user input
    cx.authorize(email)
  }
})
```

The call to `cx.authorize(email)` will send the user a validation email from web3.storage. Once they click the link, they will be able to read and write to the cloud. Logging into the app from another device is as simple as entering the same email address. Fireproof automatically syncs a copy of the database to the new device. Connected devices continue to sync.

In the repo, there is a [full plain JavaScript application](https://github.com/fireproof-storage/fireproof/blob/main/packages/fireproof/test/www/todo.html) that utilizes `connect` as well as the sharing features described below. You can [try a running copy of it here.](https://fireproof.storage/test/todo.html)

#### Note: Device Authorization

Fireproof's default option uses self-sovereign keys, generated and held by non-extractable keypair APIs in the browser. This means that the user's private signing key is never exposed to the server, and the server can't impersonate the user. The downside is that the user must be online to authorize new devices. In practice, users will need to have more than one logged-in device open at the same time to transfer initial credentials. After that, the devices can operate independently.

### Share with Friends

The below flow is meant as a bare-bones illustration of the moving parts involved. If you want to make the experience invisible to users, you can exchange these tokens in the background via your app server (if you have one.) If you don't plan to run a server, you can also [streamline the user experience compared to the below description](https://github.com/fireproof-storage/fireproof/issues/19), at the expense of a little more complexity in your handshake code, as described in the linked issue.

Say you used Fireproof's [file-sharing support](https://use-fireproof.com/docs/database-api/documents#put-with-files) to build an encrypted photo gallery, and now you want to invite friends to upload. Once all the parties are authorized, sharing is as simple as:

```js
const myShareToken = await cx.shareToken()
```

The `shareToken` is a long DID key that looks something like this: `did:key:z4MXj1wBzi9jUstyPWCrgoqyPVcZgGUPU51VmPmChhgAQ8wNqddQ3kWJ763SABec1ddBFQjk5BB7Vf1aHAkrQVpZpFqPXbechbi4STuXmmTFB4R7tRAWFeCWoHoEfn4yGvyCc7PZvTDtn9jD8mHANv3yGNvHHR1zgfHYLXsjzHyKjDpxumjPWP8uy3Sh7T2qNCsW2R2uxYHaSqRZFQ3U651EaUgf5EJNfGWRAtdXKBXJ2tPj3agEwd1UQUJHpjrfxg5wccQJ4HmNJBFrMt4CXZ8tzxkzYRc1Zx6EM6GurghidZEccKHVpKbiUFPai76CsB951vQT1GkC4DSxhDDHA4mYgCAaPnVhWzcrEqmvbt4a9ydg5jAxQ`

It's probably best to think of it as an ugly user handle or contact ID. It corresponds to the user's current device public key. By communicating it to people you want to collaborate with, you give them the opportunity to share databases with you.

On the database owner's device, they can initiate sharing by calling:

```js
const inviteLinkCid = await cx.shareWith(myShareToken)
```

The resulting CID looks something like this: `bafkreifzpfmjjmkrqwtzazzj46l6m4sa4umhyd5fv7hvjauyz2eftcvbda` -- this material is safe to publish because it can only be utilized by someone who has the private key the share token corresponds with. Send this `inviteLinkCid` to the person who's share token you used to initiate the share. They can then call:

```js
const { database, connection } = await cx.joinShared(inviteLinkCid)
```

Now you can query your shared database as usual, only results will be synced with the other participants, enabling interactive collaboration.

### Open a snapshot

Once you are connected, you can open a snapshot of the database by calling `db.openDashboard()` which will open a new window with a read-only view of the database. This is useful for debugging, or for sharing a read-only view of the database with a friend.


## S3 Storage

Read about configuring Fireproof to use S3 [here](/docs/database-api/replication#s3-connection).

## Limitations

These are not inherent limits to the software, just things that haven't been implemented yet.

* Safari multi-device authorization. This is [something with the delegation handling, looks fixable](https://github.com/web3-storage/w3up/issues/924).
* Faster handshakes. Fireproof uses [w3clock](https://github.com/web3-storage/w3clock/tree/main) as the source of truth for merging multi-user writes. It doesn't currently support websockets, but since it uses Cloudflare durable objects, this is addable. In the short term we are using polling, which works but is not thrilling.

We can use the current (not fast) channel for WebRTC signaling, and use WebRTC data-channel upgrade to near real-time sync, even without any changes to w3clock, so that is on the roadmap. Your app will get much faster with only a module upgrade on your part.

## Next Steps

Please [build an app](/docs/react-tutorial), follow the instructions above to connect it for sharing, and [tell us about it on our Discord!](https://discord.gg/JkDbYXUG7W) Here are [some app ideas to get started.](https://github.com/fireproof-storage/fireproof/discussions/6)


## Video Demo

You can [see a video demo to accompany these docs here.](https://www.youtube.com/watch?v=aN1LpSltAzo)

<iframe width="560" height="315" src="https://www.youtube.com/embed/aN1LpSltAzo?si=ru_DJd_6xv81vQix" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
