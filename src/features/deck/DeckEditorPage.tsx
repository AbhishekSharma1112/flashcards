import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { readFileAsBase64 } from "../../lib/imageUtils";
import { saveDecksToFile } from "../../lib/storage";
import type { Flashcard, Deck } from "../../Types";

const DeckEditorPage: React.FC = () => {
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newImage, setNewImage] = useState("");

  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  const openAddDialog = () => {
    setEditingCard(null); // not editing, adding new
    setNewFront("");
    setNewBack("");
    setNewImage("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (card: Flashcard) => {
    setEditingCard(card);
    setNewFront(card.front);
    setNewBack(card.back);
    setNewImage(card.image || "");
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    const base64 = await readFileAsBase64(file);
    setNewImage(base64);
  };

  const createOrUpdateCard = () => {
    if (editingCard) {
      // Update existing card
      setCards((prev) =>
        prev.map((card) =>
          card.id === editingCard.id
            ? { ...card, front: newFront, back: newBack, image: newImage }
            : card
        )
      );
    } else {
      // Add new card
      const newCard: Flashcard = {
        id: uuid(),
        front: newFront,
        back: newBack,
        image: newImage,
      };
      setCards((prev) => [...prev, newCard]);
    }
    setIsDialogOpen(false);
  };

  const saveDeck = () => {
    const newDeck: Deck = { id: uuid(), name: deckName, cards };
    saveDecksToFile([newDeck]);
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-[80%] items-center">
      <div className="flex gap-3 bg-white p-2 rounded shadow-2xs w-full">
        <input
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Deck Name"
          className="p-2 border rounded"
        />
        <button
          className="cursor-pointer bg-blue-400 text-white rounded p-2"
          onClick={openAddDialog}
        >
          Add Card
        </button>
        <button
          className="bg-blue-400 text-white rounded p-2"
          onClick={saveDeck}
        >
          Save to File
        </button>
      </div>

      {/* Display cards */}
      <div className="flex flex-wrap gap-3 justify-start w-full">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col bg-white shadow-2xs gap-2 p-4 rounded w-64 relative"
          >
            <div>
              <label className="text-sm font-semibold">Front:</label>
              <div className="bg-gray-100 p-2 rounded">{card.front}</div>
            </div>
            <div>
              <label className="text-sm font-semibold">Back:</label>
              <div className="bg-gray-100 p-2 rounded">{card.back}</div>
            </div>
            {card.image && (
              <div>
                <label className="text-sm font-semibold">Image:</label>
                <a
                  href={card.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Image
                </a>
              </div>
            )}

            <button
              onClick={() => openEditDialog(card)}
              className="text-sm bg-gray-200 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCard ? "Edit Card" : "Add New Card"}
            </h2>

            <input
              value={newFront}
              onChange={(e) => setNewFront(e.target.value)}
              placeholder="Front"
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              value={newBack}
              onChange={(e) => setNewBack(e.target.value)}
              placeholder="Back"
              className="mb-3 p-2 border rounded w-full"
            />

            {newImage ? (
              <div className="mb-2">
                <a
                  href={newImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Uploaded Image
                </a>
                <button
                  onClick={() => setNewImage("")}
                  className="ml-3 text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="new-image-upload"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="new-image-upload"
                  className="cursor-pointer bg-blue-400 text-white rounded p-2 inline-block text-sm"
                >
                  Upload Image
                </label>
              </>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-300 rounded px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={createOrUpdateCard}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                {editingCard ? "Update Card" : "Create Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckEditorPage;
