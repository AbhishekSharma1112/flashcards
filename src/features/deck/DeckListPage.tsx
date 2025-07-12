import React, { useState } from "react";
import { Link } from "wouter";
import { loadDeckFile } from "../../lib/storage";
import type { Deck } from "../../Types";
import { navigate } from "wouter/use-browser-location";

const DeckListPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[] | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const loaded = await loadDeckFile(file);
        setDecks(loaded);
      } catch (err) {
        alert(err);
      }
    }
  };

  if (!decks) {
    return (
      <div className=" bg-white p-2 rounded shadow-2xs w-full">
        <h2 className="text-2xl text-center">Import Flashcard Deck</h2>
        <div className="flex flex-col m-3 gap-2 items-center">
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-center bg-blue-400 rounded-2xl p-2 w-2xs"
          >
            Upload JSON
          </label>
          <button
            className="cursor-pointer bg-blue-400 rounded-2xl p-2 w-2xs"
            onClick={() => navigate("/edit")}
          >
            Create New Deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Decks</h2>
      <ul>
        {decks.map((deck) => (
          <li key={deck.id}>
            <Link href={`/deck/${deck.id}`}>
              {deck.name} ({deck.cards.length} cards)
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/edit">+ Create New Deck</Link>
    </div>
  );
};

export default DeckListPage;
