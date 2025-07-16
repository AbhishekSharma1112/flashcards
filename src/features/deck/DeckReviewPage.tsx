import { useState } from "react";
import { useDeckContext } from "../../context/DeckContext";
import { useRoute } from "wouter";

const DeckReviewPage = () => {
  const { decks } = useDeckContext();
  const [, params] = useRoute("/deck/:deckId");

  const deck = decks.find((d) => d.id === params?.deckId);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  if (!deck)
    return <p className="text-center mt-10 text-red-500">Deck not found</p>;

  const card = deck.cards[index];
  const isLastCard = index === deck.cards.length - 1;
  const progress = ((index + 1) / deck.cards.length) * 100;

  const goNext = () => {
    if (!isLastCard) {
      setIndex((i) => i + 1);
      setShowBack(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setShowBack(false);
  };

  return (
    <div className="max-w-sm min-w-3xs px-4 py-6 flex flex-col items-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center">{deck.name}</h2>
      <div
        className="w-full bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center space-y-4 cursor-pointer transition duration-300 hover:shadow-xl"
        style={{ minHeight: "320px", maxHeight: "420px" }}
        onClick={() => setShowBack((prev) => !prev)}
        title="Tap to flip"
      >
        {card.image && (
          <img
            src={card.image}
            alt="Flashcard"
            className="max-h-32 object-contain rounded"
          />
        )}
        <div
          className={`text-lg font-semibold text-center px-3 py-2 rounded transition-all duration-300 ${
            showBack
              ? "bg-green-100 text-green-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {showBack ? card.back : card.front}
        </div>
        <p className="text-sm text-gray-400">Tap card to flip</p>
      </div>

      <div className="mt-6">
        {showBack &&
          (!isLastCard ? (
            <button
              onClick={goNext}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Next
            </button>
          ) : (
            <button
              onClick={restart}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
            >
              Restart Deck
            </button>
          ))}
      </div>
      <div className="w-full mt-6">
        <div className="flex justify-between mb-1 text-sm text-gray-600 font-medium">
          <span>
            Card {index + 1} of {deck.cards.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-500 rounded transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DeckReviewPage;
