import { useState } from "react";

type FlashcardProps = {
  card: {
    id: number;
    question: string;
    answer: string;
  };
};

const Flashcard = ({ card }: FlashcardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="w-96 h-64 bg-white rounded shadow-lg flex items-center justify-center text-center m-6 cursor-pointer transition-transform duration-300 hover:scale-105"
    >
      <p className="text-xl font-medium">
        {flipped ? card.answer : card.question}
      </p>
    </div>
  );
};

export default Flashcard;
