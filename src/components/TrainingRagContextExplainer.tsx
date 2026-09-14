const items = [
  {
    title: "Model Training",
    description: "Knowledge learned before deployment",
    points: [
      "The model learns patterns from large datasets during development",
      "General knowledge up to a training cutoff — no access to your private data",
      "Can't be updated in real time without retraining or fine-tuning",
    ],
  },
  {
    title: "RAG",
    description: "Retrieval Augmented Generation",
    points: [
      "Searches external sources (docs, databases) when you ask a question",
      "Retrieves relevant snippets and includes them in the prompt",
      "Grounds answers in real data instead of the model's memory alone",
    ],
  },
  {
    title: "Context",
    description: "What's in the prompt right now",
    points: [
      "Everything the model sees for this request — instructions, history, attachments",
      "Can include pasted text, tool results, or retrieved documents",
      "Limited by a context window — only so much fits at once",
    ],
  },
] as const;

type TrainingRagContextExplainerProps = {
  large?: boolean;
};

export function TrainingRagContextExplainer({
  large = false,
}: TrainingRagContextExplainerProps) {
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-ko-border bg-ko-light-muted/40 p-6"
        >
          <h3
            className={`font-bold text-ko-accent ${large ? "text-3xl" : "text-2xl"}`}
          >
            {item.title}
          </h3>
          <p
            className={`mt-2 font-medium text-ko-dark ${large ? "text-xl" : "text-lg"}`}
          >
            {item.description}
          </p>
          <ul
            className={`mt-4 space-y-3 leading-relaxed text-ko-dark/80 ${
              large ? "text-xl" : "text-base"
            }`}
          >
            {item.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-ko-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
