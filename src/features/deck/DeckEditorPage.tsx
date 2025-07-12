import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { readFileAsBase64 } from "../../lib/imageUtils";
import { saveDecksToFile } from "../../lib/storage";
import type { Flashcard, Deck } from "../../Types";

const DeckEditorPage: React.FC = () => {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);

  const addCard = () => {
    setCards([...cards, { id: uuid(), front: "", back: "", image: "" }]);
  };

  const updateCard = (id: string, front: string, back: string) => {
    setCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, front, back } : card))
    );
  };

  const uploadImage = async (file: File, cardId: string) => {
    const base64 = await readFileAsBase64(file);
    setCards((prev) =>
      prev.map((card) =>
        card.id === cardId ? { ...card, image: base64 } : card
      )
    );
  };

  const saveDeck = () => {
    const newDeck: Deck = { id: uuid(), name: deckName, cards };
    saveDecksToFile([newDeck]);
  };

  return (
    <div className="flex flex-col gap-3 bg-white p-2 rounded shadow-2xs w-full items-center">
      <h2 className="text-2xl">Create a Deck</h2>
      <input
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Deck Name"
        className=""
      />
      <button
        className="cursor-pointer bg-blue-400 rounded-2xl p-2 w-2xs"
        onClick={addCard}
      >
        Add Card
      </button>

      {cards.map((card) => (
        <div key={card.id}>
          <input
            value={card.front}
            onChange={(e) => updateCard(card.id, e.target.value, card.back)}
            placeholder="Front"
          />
          <input
            value={card.back}
            onChange={(e) => updateCard(card.id, card.front, e.target.value)}
            placeholder="Back"
          />
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={(e) =>
              e.target.files && uploadImage(e.target.files[0], card.id)
            }
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-center bg-blue-400 rounded-2xl p-2 w-2xs"
          >
            Image Upload
          </label>
          {card.image && <img src={card.image} height={80} />}
        </div>
      ))}
      <button className="bg-blue-400 rounded-2xl p-2 w-2xs" onClick={saveDeck}>
        Save to File
      </button>
    </div>
  );
};

export default DeckEditorPage;
