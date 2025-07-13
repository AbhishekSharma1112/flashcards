import React, { createContext, useContext, useState } from "react";
import type { Deck } from "../Types";

type DeckContextType = {
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
};

const DeckContext = createContext<DeckContextType | null>(null);

export const DeckProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [decks, setDecks] = useState<Deck[]>([]);

  return (
    <DeckContext.Provider value={{ decks, setDecks }}>
      {children}
    </DeckContext.Provider>
  );
};

export const useDeckContext = () => {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("DeckContext must be used inside DeckProvider");
  return ctx;
};
