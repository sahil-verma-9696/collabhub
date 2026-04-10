import { YSocketIO } from "y-socket.io/dist/server";
import * as Y from "yjs";

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
  ysocketio.on("document-loaded", (doc) => {
    console.log("📄 Document loaded:", doc.name);
  });

  // ✏️ Document updated
  ysocketio.on("document-update", (doc, update) => {
    Y.applyUpdate(doc, update);

    const yXml = doc.getXmlFragment("root");
    const json = yXml.toJSON();

    console.log("========== UPDATE ==========");
    console.log("Doc:", doc.name);

    // ✅ Proper structured output
    console.dir(json, { depth: null });

    // ✅ Extract readable text
    const text = extractText(json);
    console.log("📝 Plain Text:", text);
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
