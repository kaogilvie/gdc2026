const items = [
  {
    title: "Database",
    description: "Raw storage of data",
    points: [
      "Very flexible but very technical",
      "Can't interact with this using human language or an interface",
      "SQL is the name of the game, mostly",
    ],
  },
  {
    title: "Software",
    description: "We know and love this",
    points: [
      "Easy-to-use interface",
      "some built-in reports",
      "Manual entry or bulk-entry through a UI or API",
    ],
  },
  {
    title: "MCP",
    description: "Model Context Protocol",
    points: [
      "A connection between a database or piece of software and an AI agent",
      "Allows for querying databases or software using natural language",
    ],
  },
] as const;

export function SoftwareDatabaseMcpExplainer(_props: { large?: boolean }) {
  return (
    <div className="mt-8 grid gap-5 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-ko-border bg-ko-light-muted/40 p-6"
        >
          <h3 className="text-2xl font-bold text-ko-accent">{item.title}</h3>
          <p className="mt-2 text-lg font-medium text-ko-dark">{item.description}</p>
          <ul className="mt-4 space-y-3 text-base leading-relaxed text-ko-dark/80">
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
