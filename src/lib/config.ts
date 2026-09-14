export type SlideComponent =
  | "software-database-mcp"
  | "training-rag-context"
  | "training-rag-context-activity";

export type Slide = {
  title: string;
  bullets?: string[];
  body?: string;
  component?: SlideComponent;
};

export type Topic = {
  id: string;
  label: string;
  subtitle?: string;
  largeText?: boolean;
  slides: Slide[];
};

export type PollOption = Pick<Topic, "id" | "label" | "subtitle">;

export type Presentation = {
  slug: string;
  jeopardyLabel: string;
  title: string;
  subtitle?: string;
  largeText?: boolean;
  slides: Slide[];
};

export const topics: Topic[] = [
  {
    id: "topic-a",
    label: "Storing & Retrieving Data",
    subtitle: "A survey of technologies - MCPs, Databases & GivingData",
    slides: [
      {
        title: "Software vs Databases vs MCPs",
        component: "software-database-mcp",
      },
      {
        title: "Data Retrieval: How Do I Do It?",
        bullets: [],
      },
      {
        title: "How much grant money was sent to Washington DC since January 2026?",
        body: "",
      },
    ],
  },
  {
    id: "topic-b",
    label: "AI & Real-world Data",
    subtitle: "How does AI get the information it needs to answer questions?",
    largeText: true,
    slides: [
      {
        title: "Training vs RAG vs Context",
        component: "training-rag-context",
      },
      {
        title: "The Activity",
        component: "training-rag-context-activity",
      },
      {
        title: "Training Question #1",
        body: "How many grants were focused on clean water last year?",
      },
      {
        title: "Training Question #2",
        body: "What was the biggest grant made last year?",
      },
      {
        title: "Training Question #3",
        body: "What organization most recently received a grant for clean water work?",
      },
      {
        title: "RAG Question #1",
        body: "What were the names of the biggest grants in Ohio this year?",
      },
      {
        title: "RAG Question #2",
        body: "What is the most recent grant received for clean water work?",
      },
      {
        title: "RAG Question #3",
        body: "How many of these grants mention a woman named Lenore?",
      },
      {
        title: "Context Question #1",
        body: "What organization has been working directly with the city of Springfield on a $250,000 grant?",
      },
      {
        title: "Context Question #2",
        body: "What is the most recent grant received for clean water work?",
      },
      {
        title: "Context Question #3",
        body: "What geographies did our clean water work focus on?",
      }
    ],
  },
  {
    id: "topic-c",
    label: "AI Mechanics",
    subtitle: "How AI works & how to think about the hype",
    slides: [
      {
        title: "Topic C",
        body: "Replace this slide content with your own material.",
      },
      {
        title: "Key Points",
        bullets: [
          "Add your first talking point here",
          "Add your second talking point here",
          "Add your third talking point here",
        ],
      },
      {
        title: "Summary",
        body: "Wrap up Topic C with a closing thought.",
      },
    ],
  },
  {
    id: "topic-d",
    label: "Open Q&A",
    subtitle: "Ask us anything",
    slides: [
      {
        title: "Topic D",
        body: "Replace this slide content with your own material.",
      },
      {
        title: "Key Points",
        bullets: [
          "Add your first talking point here",
          "Add your second talking point here",
          "Add your third talking point here",
        ],
      },
      {
        title: "Summary",
        body: "Wrap up Topic D with a closing thought.",
      },
    ],
  },
];

export const pollConfig = {
  question: "Which topic should we dive into?",
  options: topics.map(({ id, label, subtitle }) => ({
    id,
    label,
    subtitle,
  })) satisfies PollOption[],
};

export const presentations: Presentation[] = topics.map((topic) => ({
  slug: topic.id,
  jeopardyLabel: topic.label,
  title: topic.label,
  subtitle: topic.subtitle,
  largeText: topic.largeText,
  slides: topic.slides,
}));

export function getPresentation(slug: string): Presentation | undefined {
  return presentations.find((presentation) => presentation.slug === slug);
}
