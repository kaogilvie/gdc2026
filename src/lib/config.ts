export type SlideComponent =
  | "software-database-mcp"
  | "training-rag-context"
  | "training-rag-context-activity"
  | "word-cloud-poll";

export type WordCloudPollConfig = {
  prompt?: string;
  promptLines?: string[];
  largePrompt?: boolean;
  options: { id: string; label: string }[];
};

export type NumberedBullet = {
  text: string;
  refs?: number[];
};

export type SlideReference = {
  id: number;
  text: string;
  href: string;
};

export type Slide = {
  title?: string;
  bullets?: string[];
  numberedBullets?: NumberedBullet[];
  references?: SlideReference[];
  body?: string;
  image?: string;
  imageAlt?: string;
  imageFullWidth?: boolean;
  largeBody?: boolean;
  link?: { text: string; href: string };
  component?: SlideComponent;
  wordCloudPollId?: string;
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
        title: "Pre-2022 aka pre-ChatGPT",
        body: "Preheat the oven to 350 degrees and warp into hyperspace, making sure to stir the captain's log until it thickens.",
      },
      {
        title: "Post-2022 aka ChatGPT era",
        body: `No — this is provincial, not national. Alcohol regulation in Canada is entirely a provincial responsibility (each province/territory runs its own liquor board/commission), so there's no Canada-wide pour rule.

Quebec's restriction — where bars generally can't pour more than a single standard serving of spirits into one glass (no "doubles" poured together, though you can order two separate glasses) — comes from Quebec's own liquor permit regulations (enforced by the RACJ). It's not mirrored in most other provinces: in Ontario, BC, Alberta, etc., doubles and larger single pours are commonly legal and normal at bars, subject to server training/over-service liability rather than a hard per-glass volume cap.

So rules vary quite a bit province to province — hours of sale, minimum drinking age (18 in Quebec/Alberta/Manitoba vs. 19 elsewhere), where you can buy alcohol, and serving practices are all set independently by each province.`,
      },
      {
        title: "A Transformer?",
        image: "/bumblebee.png",
        imageAlt: "Bumblebee",
        body: "It’s night time in the town, and it’s getting dark. Let’s paint it ___?",
      },
      {
        title: "Bank, bill, closed, duck",
        component: "word-cloud-poll",
        wordCloudPollId: "bank-no-context",
      },
      {
        title: "Now the words come with some context...",
        component: "word-cloud-poll",
        wordCloudPollId: "bank-context",
      },
      {
        title: "The sentence",
        largeBody: true,
        body: "On the bank of the river, the duck's bill closed & he ____.",
      },
      {
        image: "/bank-attention.png",
        imageAlt: "Attention weights for the word bank in context",
        imageFullWidth: true,
        link: {
          text: "Attention Is All You Need",
          href: "https://arxiv.org/abs/1706.03762",
        },
      },
      {
        image: "/bill-attention.png",
        imageAlt: "Attention weights for the word bill in context",
        imageFullWidth: true,
        link: {
          text: "Attention Is All You Need",
          href: "https://arxiv.org/abs/1706.03762",
        },
      },
      {
        title: "Emergent behavior",
        numberedBullets: [
          {
            text: "Math capabilities",
            refs: [1],
          },
          {
            text: "Proving / disproving theorems",
            refs: [2],
          },
          {
            text: "Deep thinking and/or reasoning models",
            refs: [3],
          },
          {
            text: "Hacking capabilities",
            refs: [4],
          },
        ],
        references: [
          {
            id: 1,
            text: "Anthropic: Riemann Zeta Function",
            href: "https://www.anthropic.com/research/riemann-zeta",
          },
          {
            id: 2,
            text: "OpenAI: Disproving a Central Math Theorem",
            href: "https://openai.com/index/model-disproves-discrete-geometry-conjecture/",
          },
          {
            id: 3,
            text: "Google Gemini: Thinking Models",
            href: "https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/thinking",
          },
          {
            id: 4,
            text: "Anthropic: Report on Exploits",
            href: "https://www.anthropic.com/research/exploit-evals",
          },
        ],
      },
      {
        title: "",
        largeBody: true,
        body: "On the bank of the river, the duck's bill closed & he ____.",
      }
    ],
  },
  {
    id: "topic-d",
    label: "Open Q&A",
    subtitle: "Ask us anything",
    slides: [
      {
        title: "Open Q&A",
        body: "Ask us anything.",
      }
    ],
  },
];

export const wordCloudPollConfigs: Record<string, WordCloudPollConfig> = {
  "bank-no-context": {
    prompt:
      "",
    options: [
      { id: "robbery", label: "robbery" },
      { id: "teller", label: "teller" },
      { id: "shot", label: "shot" },
      { id: "swam", label: "swam" },
    ],
  },
  "bank-context": {
    promptLines: [
      "Bank -- river",
      "bill -- closed + duck",
      "closed -- duck + bill",
      "duck -- bill + closed"
    ],
    largePrompt: true,
    options: [
      { id: "robbery", label: "robbery" },
      { id: "teller", label: "teller" },
      { id: "shot", label: "shot" },
      { id: "swam", label: "swam" },
    ],
  },
};

export function getWordCloudPollConfig(
  pollId: string,
): WordCloudPollConfig | undefined {
  return wordCloudPollConfigs[pollId];
}

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
