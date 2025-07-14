import type { Deck } from "../Types";
import { v4 as uuidv4 } from "uuid";

export const loadDeckFile = async (file: File): Promise<Deck[]> => {
  const text = await file.text();
  const json = JSON.parse(text);

  // Normalize to array
  const decks: Deck[] = Array.isArray(json) ? json : [json];

  // Ensure each deck has an ID
  return decks.map((deck) => ({
    id: deck.id || uuidv4(),
    name: deck.name || "Untitled Deck",
    cards: deck.cards || [],
  }));
};

export const saveDecksToFile = (decks: Deck[]) => {
  const blob = new Blob([JSON.stringify(decks, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "decks.json";
  a.click();
};
