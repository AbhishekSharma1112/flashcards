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

  const nextCard = () => {
    if (index < deck.cards.length - 1) {
      setIndex(index + 1);
      setShowBack(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setShowBack(false);
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4 text-center">{deck.name}</h2>
      <div className="bg-white border rounded-xl shadow-md p-6 text-center space-y-4">
        {card.image && (
          <img
            src={card.image}
            alt="flashcard"
            className="mx-auto max-h-64 object-contain rounded"
          />
        )}
        <h3 className="text-xl font-semibold">
          {showBack ? card.back : card.front}
        </h3>

        {!showBack ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => setShowBack(true)}
          >
            See Answer
          </button>
        ) : (
          <>
            {index < deck.cards.length - 1 ? (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={nextCard}
              >
                Next
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={restart}
                >
                  Restart
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <p className="text-center text-gray-500 mt-6">
        Card {index + 1} of {deck.cards.length}
      </p>
    </div>
  );
};

export default DeckReviewPage;
