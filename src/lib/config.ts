export type PollOption = {
  id: string;
  label: string;
};

export type Slide = {
  title: string;
  bullets?: string[];
  body?: string;
};

export type Presentation = {
  slug: string;
  jeopardyLabel: string;
  title: string;
  subtitle: string;
  slides: Slide[];
};

export const pollConfig = {
  question: "Which topic should we dive into?",
  options: [
    { id: "topic-a", label: "Topic A" },
    { id: "topic-b", label: "Topic B" },
    { id: "topic-c", label: "Topic C" },
    { id: "topic-d", label: "Topic D" },
  ] satisfies PollOption[],
};

export const presentations: Presentation[] = [
  {
    slug: "topic-a",
    jeopardyLabel: "Topic A",
    title: "Topic A",
    subtitle: "First presentation deck",
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
    slug: "topic-b",
    jeopardyLabel: "Topic B",
    title: "Topic B",
    subtitle: "Second presentation deck",
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
    slug: "topic-c",
    jeopardyLabel: "Topic C",
    title: "Topic C",
    subtitle: "Third presentation deck",
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
    slug: "topic-d",
    jeopardyLabel: "Topic D",
    title: "Topic D",
    subtitle: "Fourth presentation deck",
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

export function getPresentation(slug: string): Presentation | undefined {
  return presentations.find((presentation) => presentation.slug === slug);
}
