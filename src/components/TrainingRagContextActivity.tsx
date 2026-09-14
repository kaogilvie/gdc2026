const items = [
  {
    title: "Training",
    description: "",
    points: [
      "Participant has a paper & pen",
      "They have a paragraph read to them once", 
      "They can write down whatever they'd like & refer to it"
    ],
  },
  {
    title: "RAG",
    description: "",
    points: [
      "They have a folder of information",
      "The information is organized into pages",
      "There is also a table of contents"
    ],
  },
  {
    title: "Context",
    description: "",
    points: [
      "They get a piece of paper with a paragraph on it",
      "They can refer to it whenever they'd like"
    ],
  },
] as const;

type TrainingRagContextActivityProps = {
  large?: boolean;
};

export function TrainingRagContextActivity({
  large = false,
}: TrainingRagContextActivityProps) {
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
          {item.description ? (
            <p
              className={`mt-2 font-medium text-ko-dark ${large ? "text-xl" : "text-lg"}`}
            >
              {item.description}
            </p>
          ) : null}
          <ul
            className={`${item.description ? "mt-4" : "mt-2"} space-y-3 leading-relaxed text-ko-dark/80 ${
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
