import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllDecks, saveDeck } from "../lib/indexedDb";
import type { Deck } from "../Types";

const DeckContext = createContext<{
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
}>({
  decks: [],
  setDecks: () => {},
});

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [decks, setDecksState] = useState<Deck[]>([]);

  useEffect(() => {
    (async () => {
      const loaded = await getAllDecks();
      setDecksState(loaded);
    })();
  }, []);

  const setDecks = async (newDecks: Deck[]) => {
    setDecksState(newDecks);
    for (const deck of newDecks) {
      await saveDeck(deck);
    }
  };

  return (
    <DeckContext.Provider value={{ decks, setDecks }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeckContext = () => useContext(DeckContext);
