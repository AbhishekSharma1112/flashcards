import { useState } from "react";
import Flashcard from "./components/Flashcard";

type Card = {
  id: number;
  question: string;
  answer: string;
};

const cards: Card[] = [
  {
    id: 1,
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces",
  },
  {
    id: 2,
    question: "What is TypeScript?",
    answer: "A typed superset of JavaScript",
  },
  {
    id: 3,
    question: "What is Tailwind CSS?",
    answer: "A utility-first CSS framework",
  },
];

function App() {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % cards.length);
  };

  return (
    <>
      <header className="flex justify-center">
        <h1 className="text-3xl font-bold m-6">Flashcards App</h1>
      </header>

      <main className="min-h-screen bg-gray-100 flex flex-col items-center p-2">
        <Flashcard card={cards[currentCard]} />
        <button
          onClick={nextCard}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </main>
    </>
  );
}

export default App;
