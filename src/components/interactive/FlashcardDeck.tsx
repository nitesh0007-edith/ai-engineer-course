import { useId, useState } from "react";

type Card = { front: string; back: string };

export default function FlashcardDeck({ cards }: { cards: Card[] }) {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const card = cards[index];

  function move(next: number) {
    setIndex(next);
    setRevealed(false);
  }

  return (
    <section className="flashcard-deck" aria-labelledby={titleId}>
      <div className="flashcard-head">
        <h3 id={titleId}>Flashcards</h3>
        <span aria-live="polite">
          {index + 1} of {cards.length}
        </span>
      </div>
      <button
        type="button"
        className={`flashcard ${revealed ? "revealed" : ""}`}
        onClick={() => setRevealed((value) => !value)}
        aria-expanded={revealed}
      >
        <span className="flashcard-label">
          {revealed ? "Answer" : "Question"}
        </span>
        <span>{revealed ? card.back : card.front}</span>
        <small>
          {revealed
            ? "Select to show the question"
            : "Select to reveal the answer"}
        </small>
      </button>
      <div className="flashcard-controls">
        <button
          type="button"
          onClick={() => move(index - 1)}
          disabled={index === 0}
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => move(index + 1)}
          disabled={index === cards.length - 1}
        >
          Next →
        </button>
      </div>
    </section>
  );
}
