import type { Deck } from "../Types";

export const loadDeckFile = (file: File): Promise<Deck[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const decks = JSON.parse(event.target?.result as string);
        resolve(decks);
      } catch (err) {
        reject("Invalid JSON file");
      }
    };
    reader.onerror = () => reject("File read error");
    reader.readAsText(file);
  });
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
