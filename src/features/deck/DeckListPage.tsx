import React from "react";
import { Link } from "wouter";
import { loadDeckFile } from "../../lib/storage";
import { navigate } from "wouter/use-browser-location";
import { useDeckContext } from "../../context/DeckContext";

const DeckListPage: React.FC = () => {
  const { decks, setDecks } = useDeckContext();
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

  if (!decks || decks.length <= 0) {
    return (
      <div className=" bg-white p-2 rounded shadow-2xs w-[80%]">
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
    <div className="flex flex-col bg-white w-[80%] items-center h-[80%] min-h-[80%]">
      <h2 className="text-2xl">Your Decks</h2>
      <ul className="flex gap-3 mt-4">
        {decks.map((deck) => (
          <li key={deck.id} className="border rounded shadow-2xs">
            <Link href={`/deck/${deck.id}`}>
              {deck.name} ({deck.cards.length} cards)
            </Link>
          </li>
        ))}
        <li>
          <Link href="/edit">Create New Deck</Link>
        </li>
      </ul>
    </div>
  );
};

export default DeckListPage;
