import type { PageMeta } from "@/hooks/use-app-data";
import { openDB } from "idb";

export const DB_NAME = "collabhub";

export const OBJECT_STORE = {
  PAGES: "pages",
  PAGES_META: "pagesMeta",
} as const;

export const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    db.createObjectStore(OBJECT_STORE.PAGES);
    db.createObjectStore(OBJECT_STORE.PAGES_META);
  },
});

export async function setPage(clientId: string, content: string | object) {
  const db = await dbPromise;

  await db.put(
    OBJECT_STORE.PAGES,
    {
      clientId,
      content,
    },
    clientId,
  );
}

export async function getPage(clientId: string) {
  const db = await dbPromise;

  return db.get(OBJECT_STORE.PAGES, clientId);
}

export async function createPageMetaWithPage(payload: PageMeta) {
  const db = await dbPromise;

  await db.put(OBJECT_STORE.PAGES_META, payload, payload.clientId);

  await db.put(
    OBJECT_STORE.PAGES,
    {
      clientId: payload.clientId,
      content: "",
    },
    payload.clientId,
  );
}

export async function setPageMeta(clientId: string, payload: PageMeta) {
  const db = await dbPromise;

  await db.put(OBJECT_STORE.PAGES_META, payload, clientId);
}

export async function getPageMeta(clientId: string) {
  const db = await dbPromise;

  return db.get(OBJECT_STORE.PAGES_META, clientId);
}

export async function getPageMetas() {
  const db = await dbPromise;

  return db.getAll(OBJECT_STORE.PAGES_META);
}

export async function deletePageMeta(payload: PageMeta) {
  const db = await dbPromise;

  // Cascade delete
  await db.delete(OBJECT_STORE.PAGES_META, payload.clientId);

  await db.delete(OBJECT_STORE.PAGES, payload.clientId);
}
