import { openDB } from "idb";
import type { Deck } from "../Types";

const DB_NAME = "flashcard-db";
const DB_VERSION = 1;
const DECK_STORE = "decks";

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(DECK_STORE)) {
        db.createObjectStore(DECK_STORE, { keyPath: "id" });
      }
    },
  });
};

export const saveDeck = async (deck: Deck) => {
  const db = await initDB();
  await db.put(DECK_STORE, deck);
};

export const getAllDecks = async (): Promise<Deck[]> => {
  const db = await initDB();
  return await db.getAll(DECK_STORE);
};

export const deleteDeck = async (id: string) => {
  const db = await initDB();
  await db.delete(DECK_STORE, id);
};
