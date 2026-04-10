import { YSocketIO } from "y-socket.io/dist/server";
import * as Y from "yjs";
import * as PageRepo from "../repos/PageRepo.js";

function extractText(node) {
  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    return node.map(extractText).join("");
  }

  if (node?.text) {
    return node.text;
  }

  if (node?.children) {
    return extractText(node.children);
  }

  return "";
}

export function YSocket(socket) {
  const ysocketio = new YSocketIO(socket);

  // 📄 Document created
  ysocketio.on("document-loaded", async (doc) => {
    console.log("📄 Loading:", doc.name);

    const page = await PageRepo.getById(doc.name);

    if (page?.content) {
      Y.applyUpdate(doc, new Uint8Array(page.content));
      console.log("✅ Restored from DB");
    } else {
      console.log("🆕 New document");
    }
  });

  // ✏️ Document updated
  ysocketio.on("document-update", async (doc, update) => {
    Y.applyUpdate(doc, update);

    // 🔥 encode full state
    const snapshot = Y.encodeStateAsUpdate(doc);

    // doc.name = your pageId
    await PageRepo.updateById(doc.name, {
      content: Buffer.from(snapshot),
    });

    console.log("💾 Snapshot saved to Page:", doc.name);
  });

  // 👥 Awareness (users / cursors)
  ysocketio.on("awareness-update", (doc) => {
    console.log("👥 Awareness update in:", doc.name);
  });

  // 🚪 All users left
  ysocketio.on("all-document-connections-closed", (doc) => {
    console.log("🚪 All users left:", doc.name);
  });

  // 🗑️ Document destroyed
  ysocketio.on("document-destroy", (doc) => {
    console.log("🗑️ Document destroyed:", doc.name);
  });

  ysocketio.initialize();
}
