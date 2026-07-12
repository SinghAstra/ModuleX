import { RepositoryStatus } from "@repo/shared";
import { Cpu, Link2, FileText } from "lucide-react";

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
    title: "Get Your README",
    description:
      "Instantly receive a perfect, production-ready README file complete with a system overview, tech stack, and core module breakdown.",
    icon: FileText,
  },
];

export const reviews = [
  {
    name: "Michael Chen",
    rating: 5,
    review:
      "A total lifesaver. ReadmeX generated a complete architecture guide for a legacy codebase in seconds. It perfectly explained the system.",
  },
  {
    name: "Emily Watson",
    rating: 5,
    review:
      "The generated documentation is incredible. It doesn't just list files; it actually understands and explains the system design in plain English.",
  },
  {
    name: "David Kumar",
    rating: 5,
    review:
      "I use this to document all my open-source projects. It saves me hours of writing and formatting markdown files.",
  },
  {
    name: "Sophia Rossi",
    rating: 4,
    review:
      "Fantastic tool. It gave me a clear system overview and extracted the exact tech stack without me having to write a single word.",
  },
  {
    name: "James Thompson",
    rating: 5,
    review:
      "Absolutely game-changing. We use it to automatically generate high-level documentation for every new module in our monorepo.",
  },
  {
    name: "Olivia Zhang",
    rating: 4,
    review:
      "Simple, effective, and fast. It takes messy, undocumented code and turns it into beautiful, structured documentation instantly.",
  },
  {
    name: "William Smith",
    rating: 5,
    review:
      "ReadmeX is now a permanent part of my workflow. Writing docs used to be a chore, but now it is done with one click.",
  },
  {
    name: "Mia Lindholm",
    rating: 5,
    review:
      "Other tools just give you a giant, unreadable graph diagram. ReadmeX actually gives you clean, readable, and professional markdown.",
  },
  {
    name: "Henry Fletcher",
    rating: 5,
    review:
      "This transformed our team. We drop a link into ReadmeX to instantly generate a high-level map of the codebase before writing new features.",
  },
];

export const FAQ = [
  {
    id: "item-1",
    question: "How does ReadmeX work?",
    answer:
      "Just paste a GitHub link. Our AI groups your code into logical modules, understands the architecture, and writes a complete README file for you.",
  },
  {
    id: "item-2",
    question: "Do I need to download or clone anything?",
    answer:
      "Not at all! ReadmeX runs entirely in your browser. You don't have to download heavy folders. Paste the link, and we handle the rest.",
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
      "Yes! ReadmeX is built for that. We smartly group related files together so the AI understands the broad architecture without getting overwhelmed by messy details.",
  },
  {
    id: "item-6",
    question: "Can I use it on private repositories?",
    answer:
      "Right now, ReadmeX works with public GitHub repositories. Private repository support is our top priority and is launching very soon.",
  },
  {
    id: "item-7",
    question: "Are the generated READMEs actually accurate?",
    answer:
      "Yes. Our AI looks at how files and folders talk to each other across the entire codebase to write an accurate, high-level system overview.",
  },
  {
    id: "item-8",
    question: "Who is ReadmeX built for?",
    answer:
      "It is perfect for developers who hate writing documentation, open-source maintainers, or tech leads who need quick architecture guides for legacy projects.",
  },
];

export const STATUS_BORDER_MAP: Record<RepositoryStatus, string> = {
  PENDING: "border border-yellow-400 border-2",
  PROCESSING: "border border-yellow-400 border-2",
  COMPLETED: "border border-green-400 border-2",
  FAILED: "border border-red-400 border-2",
} as const;