import { useId, useState } from "react";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export default function QuizCard({ questions }: { questions: QuizQuestion[] }) {
  const groupId = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <section className="quiz-deck" aria-labelledby={`${groupId}-title`}>
      <h3 id={`${groupId}-title`} className="visually-hidden">
        Knowledge check
      </h3>
      {questions.map((item, questionIndex) => {
        const selected = answers[questionIndex];
        const answered = selected !== undefined;
        const correct = selected === item.answer;
        return (
          <fieldset className="quiz-card" key={item.question}>
            <legend>
              <span>{questionIndex + 1}</span>
              {item.question}
            </legend>
            <div className="quiz-options">
              {item.options.map((option, optionIndex) => (
                <label key={option}>
                  <input
                    type="radio"
                    name={`${groupId}-${questionIndex}`}
                    checked={selected === optionIndex}
                    onChange={() =>
                      setAnswers((old) => ({
                        ...old,
                        [questionIndex]: optionIndex,
                      }))
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {answered && (
              <p
                className={`quiz-feedback ${correct ? "correct" : "incorrect"}`}
                role="status"
              >
                <strong>{correct ? "Correct." : "Not quite."}</strong>{" "}
                {item.explanation}
              </p>
            )}
          </fieldset>
        );
      })}
    </section>
  );
}
