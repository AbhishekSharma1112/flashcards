export type Flashcard = {
  id: string;
  front: string;
  back: string;
  image?: string;
};

export type Deck = {
  id: string;
  name: string;
  cards: Flashcard[];
};
