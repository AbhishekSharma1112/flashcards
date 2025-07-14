import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { useDeckContext } from "../../context/DeckContext";
import { useParams } from "wouter";
import { readFileAsBase64 } from "../../lib/imageUtils";
import { saveDecksToFile } from "../../lib/storage";
import { saveDeck } from "../../lib/indexedDb";
import type { Flashcard, Deck } from "../../Types";
import { navigate } from "wouter/use-browser-location";

type CardFormState = {
  id?: string;
  front: string;
  back: string;
  image?: string;
};

const emptyCardState: CardFormState = { front: "", back: "", image: "" };

const DeckEditorPage: React.FC = () => {
  const { deckId } = useParams();
  const { decks, setDecks } = useDeckContext();

  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [editingCard, setEditingCard] = useState<CardFormState | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isEditing = Boolean(deckId);

  // Load existing deck if editing
  useEffect(() => {
    if (isEditing) {
      const deck = decks.find((d) => d.id === deckId);
      if (deck) {
        setDeckName(deck.name);
        setCards(deck.cards);
      }
    }
  }, [deckId, decks]);

  const handleOpenDialog = (card?: Flashcard) => {
    setEditingCard(
      card
        ? { id: card.id, front: card.front, back: card.back, image: card.image }
        : { ...emptyCardState }
    );
    setIsDialogOpen(true);
  };

  const handleCardSave = () => {
    if (!editingCard?.front || !editingCard.back)
      return alert("Front & Back required");
    const updated = editingCard.id
      ? cards.map((c) =>
          c.id === editingCard.id ? { ...editingCard, id: c.id } : c
        )
      : [...cards, { ...editingCard, id: uuid() }];
    setCards(updated as Flashcard[]);
    setIsDialogOpen(false);
  };

  const handleImageUpload = async (file: File) => {
    const base64 = await readFileAsBase64(file);
    setEditingCard((prev) => (prev ? { ...prev, image: base64 } : prev));
  };

  const handleSaveDeck = async () => {
    const trimmedName = deckName.trim();
    if (!trimmedName) return alert("Deck name is required");

    const isDuplicateName = decks.some(
      (d) => d.name === trimmedName && (!deckId || d.id !== deckId)
    );
    if (isDuplicateName) return alert("Deck name already exists");

    const newDeck: Deck = {
      id: deckId || uuid(),
      name: trimmedName,
      cards,
    };

    await saveDeck(newDeck);
    const updatedDecks = decks
      .filter((d) => d.id !== newDeck.id)
      .concat(newDeck);
    setDecks(updatedDecks);
    navigate("/");
  };

  const handleExport = () => {
    saveDecksToFile([
      {
        id: deckId || uuid(),
        name: deckName.trim(),
        cards,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-3 p-2 w-[80%] items-center">
      {/* Toolbar */}
      <div className="flex gap-3 bg-white p-2 rounded shadow-2xs w-full">
        <input
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          placeholder="Deck Name"
          className="p-2 border rounded w-full"
        />
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-400 text-white rounded p-2"
        >
          Add Card
        </button>
        <button
          onClick={handleSaveDeck}
          className="bg-green-500 text-white rounded p-2"
        >
          Save Deck
        </button>
        <button
          onClick={handleExport}
          className="bg-blue-400 text-white rounded p-2"
        >
          Export to File
        </button>
      </div>

      {/* Card list */}
      <div className="flex flex-wrap gap-3 justify-start w-full">
        {cards.map((card) => (
          <div key={card.id} className="bg-white shadow-2xs p-4 rounded w-64">
            <div>
              <strong>Front:</strong>
              <div className="bg-gray-100 p-2 rounded">{card.front}</div>
            </div>
            <div>
              <strong>Back:</strong>
              <div className="bg-gray-100 p-2 rounded">{card.back}</div>
            </div>
            {card.image && (
              <div>
                <strong>Image:</strong>
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
              onClick={() => handleOpenDialog(card)}
              className="text-sm mt-2 bg-gray-200 rounded px-2 py-1"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isDialogOpen && editingCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCard.id ? "Edit Card" : "Add New Card"}
            </h2>
            <input
              value={editingCard.front}
              onChange={(e) =>
                setEditingCard(
                  (prev) => prev && { ...prev, front: e.target.value }
                )
              }
              placeholder="Front"
              className="mb-3 p-2 border rounded w-full"
            />
            <input
              value={editingCard.back}
              onChange={(e) =>
                setEditingCard(
                  (prev) => prev && { ...prev, back: e.target.value }
                )
              }
              placeholder="Back"
              className="mb-3 p-2 border rounded w-full"
            />
            {editingCard.image ? (
              <div className="mb-2">
                <a
                  href={editingCard.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Uploaded Image
                </a>
                <button
                  onClick={() =>
                    setEditingCard((prev) => prev && { ...prev, image: "" })
                  }
                  className="ml-3 text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && handleImageUpload(e.target.files[0])
                  }
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-400 text-white rounded p-2 text-sm"
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
                onClick={handleCardSave}
                className="bg-blue-500 text-white rounded px-4 py-2"
              >
                {editingCard.id ? "Update Card" : "Create Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckEditorPage;
