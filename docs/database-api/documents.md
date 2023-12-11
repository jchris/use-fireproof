---
sidebar_position: 2.5
---

# Documents

Fireproof uses JSON documents to store data. Documents are stored in a single collection, and each document has a unique ID. Documents can be read, written, and deleted. Validation functions can prevent unwanted changes from being written to the database.

## Document read and write

### `put()`

To write and read a new document in Fireproof, you just call the `put` function and the `get` function:

```js
const putResponse = await database.put({hello : "world"})
// { id, clock }
const theDocument = await database.get(putResponse.id)
// { _id, hello : "world"  }
```

### `put() with Files`

If you add an upload `<input>` to your html like this:

```html
<input accept="image/*" title="save to Fireproof" type="file" id="files" multiple>
```

And some JS to handle it:

```js
function handleFiles() {
  const fileList = this.files;
  const doc = {
    type: "files",
    _files: {}
  }
  for (const file of fileList) {
    // assign the File object to the document
    // under doc._files["myname.jpeg"]
    doc._files[file.name] = file
  }
  const ok = db.put(doc);
}

const fileInput = document.getElementById("files");
fileInput.addEventListener("change", handleFiles, false);
```

Fireproof will take care of encoding it to UnixFS, encrypting it, and replicating with your chosen storage backend. There is a 1MB limit per document, but we have a plan to remove the limit in the future. You should use these files for data you want replicated and available offline with the database. By default the files are encrypted, so they are safe to store in untrusted storage. 

To get files back out, you `get` the document, and access the files from the `_files` property. 

The result looks like:

```js
{
  _id: "my-doc",
  _files: {
    "myname.jpeg": {
      type: "image/jpeg",
      size: 12345,
      file: () => Promise<File>
    }
  }
}
```

Here's an example. Note how we use `await` to get the file from the promise, and also that we've wrapped each file in an async function so the images can load in parallel:

```js
const doc = await db.get(ok.id)

// adjust this for your app
const li = document
            .querySelector('ul')
            .appendChild(document.createElement('li'))

for (const file of Object.keys(doc._files)) {
  (async () => {
    const meta = doc._files[file]
    if (meta.file && /image/.test(meta.type)) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(await meta.file());
      img.height = 100;
      img.onload = () => {
        URL.revokeObjectURL(img.src);
      };
      li.appendChild(img);
    }
  })();
}
```

[Read more about Files on the web at MDN.](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications) And [follow along with feature developement.](https://github.com/fireproof-storage/fireproof/discussions/9)

#### Public Files

The public files API looks just like above, except you save to `doc._publicFiles` instead of `doc._files` and the files are not encrypted. This is useful for storing files that you want to share with the world, like images for your website. In addition to the `car`, `cid`, and `size` properties, public files also have a `url` property that you can use to access the file directly from the web3.storage content delivery network. 

The feature is designed to support systems like self-publishing blogs, which can write their own markdown to html output, reference assets, etc. The default encrpyted `_files` interface is better suited to social media sharing, field data collection, and other controlled access data sharing.

The public file feature is only available on the IPFS connector.

### `get()`

When special fields like `id` or `clock` appear in the document, they are prefixed with an underscore, like `_id` above. If you don't specify an `_id` in your document body, Fireproof will generate one for you. That is what is returned as `putResponse.id` above.

Updates are as simple as modifying the document and putting it back.

```js
theDocument.hello = "everybody"
const putResponse2 = await database.put(theDocument)
// { id, clock }
const theDocumentV2 = await database.get(putResponse.id)
// { _id, hello : "everybody" }
```

By default MVCC is not enabled, so you can put to the same `id` over and over again without failure, like this:

```js
theDocument.hello = "again"
const putResponse3 = await database.put(theDocument)
theDocument.hello = "there"
const putResponse4 = await database.put(theDocument)
```

If multiple users are working this way, whoever writes last wins, overwriting the other changes (at least until conflict merge.)

## Multi-version concurrency control (MVCC) (available in alpha, coming soon in beta)

If you want to prevent that scenario, you can enable multi-version concurrency control, which will require that writers prove they are updating from the latest version, or else the write fails. This can give them a chance to reload from the source and incorporate their changes before writing, instead of doing it later as a conflict merge.

The put response includes an `id` which is unique for the document in the database, and a `clock` which represents the current snapshot of the database. You can also request that Fireproof inline the clock with the document by passing the `{ mvcc: true }` option:

```js
const theDocumentV4 = await database.get(putResponse.id, { mvcc: true })
// theDocumentV4._clock === putResponse4.clock
```

If the clock is inline in the document it will protect against writing with stale data. Here's what happens if another update comes in before the document loaded with `{ mvcc: true }`:

```js
theDocument.hello = "friends"
const putResponse5 = await database.put(theDocument)
// now theDocumentV4, which has _clock, is out of date
const putResponse5 = await database.put(theDocumentV4)
// throws new Error('MVCC conflict, document is changed, please reload the document and try again.')
```

In this way you can protect against users being surprised by accidental data overwrites.

