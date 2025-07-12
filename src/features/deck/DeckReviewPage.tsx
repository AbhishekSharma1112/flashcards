import { useState } from "react";
import { useRoute } from "wouter";
import type { Deck } from "../../Types";

// Placeholder state; should be passed/shared across app
const MOCK_DECKS: Deck[] = [];

const DeckReviewPage = () => {
  const [match, params] = useRoute("/deck/:deckId");
  const deck = MOCK_DECKS.find((d) => d.id === params?.deckId);

  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  if (!deck) return <p>Deck not found</p>;

  const card = deck.cards[index];

  const nextCard = () => {
    if (index < deck.cards.length - 1) {
      setIndex(index + 1);
      setShowBack(false);
    }
  };

  return (
    <div>
      <h2>{deck.name}</h2>
      <p>
        Card {index + 1} of {deck.cards.length}
      </p>
      <div>
        {card.image && <img src={card.image} alt="flashcard" height={100} />}
        <h3>{showBack ? card.back : card.front}</h3>
        {!showBack ? (
          <button onClick={() => setShowBack(true)}>See Answer</button>
        ) : (
          <button onClick={nextCard}>Next</button>
        )}
      </div>
      {index === deck.cards.length - 1 && showBack && (
        <>
          <button onClick={() => setIndex(0)}>Restart</button>
        </>
      )}
    </div>
  );
};

export default DeckReviewPage;
