import { RepositoryStatus } from "@repo/shared";
import { Cpu, FolderTree, Link2 } from "lucide-react";

export const processSteps = [
  {
    title: "Paste Repository URL",
    description:
      "Drop the link to any public GitHub repository. No local setups, no API tokens, and zero configuration needed.",
    icon: Link2,
  },
  {
    title: "AI Architecture Mapping",
    description:
      "Our system groups your files into logical modules, understanding how your code connects without getting lost in the details.",
    icon: Cpu,
  },
  {
    title: "Explore the Codebase",
    description:
      "Instantly navigate an interactive file tree alongside high-level architectural summaries to understand how everything works.",
    icon: FolderTree,
  },
];

export const reviews = [
  {
    name: "Michael Chen",
    rating: 5,
    review:
      "A total lifesaver. ModuleX mapped out the complete architecture for a legacy codebase in seconds. Onboarding used to take weeks.",
  },
  {
    name: "Emily Watson",
    rating: 5,
    review:
      "The generated module summaries are incredible. It doesn't just list files; it actually explains the system design in plain English.",
  },
  {
    name: "David Kumar",
    rating: 5,
    review:
      "I use this to explore large open-source projects before contributing. It saves me hours of reading through nested folders.",
  },
  {
    name: "Sophia Rossi",
    rating: 4,
    review:
      "Fantastic tool. It gave me a clear system overview and broke down the exact tech stack of a massive monorepo instantly.",
  },
  {
    name: "James Thompson",
    rating: 5,
    review:
      "Absolutely game-changing. We use it to quickly visualize high-level directory structures for every new service our team inherits.",
  },
  {
    name: "Olivia Zhang",
    rating: 4,
    review:
      "Simple, effective, and fast. It takes messy, undocumented code and turns it into a structured, easy-to-navigate dashboard.",
  },
  {
    name: "William Smith",
    rating: 5,
    review:
      "ModuleX is now a permanent part of my workflow. Getting up to speed on new client projects is done with one click.",
  },
  {
    name: "Mia Lindholm",
    rating: 5,
    review:
      "Other tools just give you a giant, unreadable graph diagram. ModuleX actually gives you a clean file tree with human-readable context.",
  },
  {
    name: "Henry Fletcher",
    rating: 5,
    review:
      "This transformed our team. We drop a link into ModuleX to instantly generate a high-level map of the codebase before writing new features.",
  },
];

export const FAQ = [
  {
    id: "item-1",
    question: "How does ModuleX work?",
    answer:
      "Just paste a GitHub link. Our AI groups your code into logical modules, understands the architecture, and builds an interactive dashboard to explore the codebase.",
  },
  {
    id: "item-2",
    question: "Do I need to download or clone anything?",
    answer:
      "Not at all! ModuleX runs entirely in your browser. You don't have to download heavy folders. Paste the link, and we handle the rest.",
  },
  {
    id: "item-3",
    question: "Is my code safe? Will it train the AI?",
    answer:
      "Your code is 100% safe. We never use your code, projects, or intellectual property to train AI models. What's yours stays yours.",
  },
  {
    id: "item-4",
    question: "What programming languages do you support?",
    answer:
      "We support almost all popular languages, including JavaScript, TypeScript, Python, Rust, Go, and Java.",
  },
  {
    id: "item-5",
    question: "Can it handle massive or messy codebases?",
    answer:
      "Yes! ModuleX is built for that. We smartly group related files together so the AI understands the broad architecture without getting overwhelmed by messy details.",
  },
  {
    id: "item-6",
    question: "Can I use it on private repositories?",
    answer:
      "Right now, ModuleX works with public GitHub repositories. Private repository support is our top priority and is launching very soon.",
  },
  {
    id: "item-7",
    question: "Are the generated summaries actually accurate?",
    answer:
      "Yes. Our AI analyzes how files and folders interact across the entire codebase to write accurate, high-level summaries of each module.",
  },
  {
    id: "item-8",
    question: "Who is ModuleX built for?",
    answer:
      "It is perfect for developers onboarding to new projects, open-source contributors, or tech leads who need to quickly visualize the architecture of legacy systems.",
  },
];

export const STATUS_BORDER_MAP: Record<RepositoryStatus, string> = {
  PENDING: "border border-yellow-400 border-2",
  PROCESSING: "border border-yellow-400 border-2",
  COMPLETED: "border border-green-400 border-2",
  FAILED: "border border-red-400 border-2",
} as const;
