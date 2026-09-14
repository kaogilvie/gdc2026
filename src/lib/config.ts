export type Slide = {
  title: string;
  bullets?: string[];
  body?: string;
};

export type Topic = {
  id: string;
  label: string;
  subtitle?: string;
  slides: Slide[];
};

export type PollOption = Pick<Topic, "id" | "label" | "subtitle">;

export type Presentation = {
  slug: string;
  jeopardyLabel: string;
  title: string;
  subtitle?: string;
  slides: Slide[];
};

export const topics: Topic[] = [
  {
    id: "topic-a",
    label: "Storing & Retrieving Data",
    subtitle: "A survey of technologies - MCPs, Databases & GivingData",
    slides: [
      {
        title: "Topic A",
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
        body: "Wrap up Topic A with a closing thought.",
      },
    ],
  },
  {
    id: "topic-b",
    label: "AI & Real-world Data",
    subtitle: "How does AI get the information it needs to answer questions?",
    slides: [
      {
        title: "Topic B",
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
        body: "Wrap up Topic B with a closing thought.",
      },
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
  slides: topic.slides,
}));

export function getPresentation(slug: string): Presentation | undefined {
  return presentations.find((presentation) => presentation.slug === slug);
}
