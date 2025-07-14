import React from "react";
import { Link } from "wouter";
import { loadDeckFile } from "../../lib/storage";
import { navigate } from "wouter/use-browser-location";
import { useDeckContext } from "../../context/DeckContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

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

  return (
    <div className="flex flex-col items-center bg-white w-[80%] h-[80%] min-h-[80%] p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Decks</h2>

      {decks.length === 0 && (
        <div className="flex flex-col gap-3 items-center">
          <input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-blue-400 text-white px-4 py-2 rounded-2xl"
          >
            Upload JSON
          </label>
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded-2xl"
            onClick={() => navigate("/edit")}
          >
            Create New Deck
          </button>
        </div>
      )}

      {decks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 w-full">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="relative p-4 rounded-2xl shadow-2xs border bg-white hover:shadow-md transition"
            >
              <Link href={`/deck/${deck.id}`} className="block">
                <h3 className="text-lg font-bold">{deck.name}</h3>
                <p className="text-sm text-gray-500">
                  {deck.cards.length} cards
                </p>
              </Link>
              <button
                onClick={() => navigate(`/edit/${deck.id}`)}
                className="absolute top-2 right-2 text-gray-500 hover:text-blue-600"
                title="Edit Deck"
              >
                <PencilSquareIcon className="size-6" />
              </button>
            </div>
          ))}

          {/* Create New Deck Card */}
          <button
            onClick={() => navigate("/edit")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed opacity-60 hover:opacity-100 hover:shadow-md transition"
          >
            <span className="text-4xl text-gray-400">+</span>
            <span className="text-sm font-medium mt-2 text-gray-500">
              Create New Deck
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default DeckListPage;
