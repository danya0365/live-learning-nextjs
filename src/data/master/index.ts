// Re-export all master data
export * from "./lessons";
export * from "./modules";
export * from "./phases";
export * from "./projects";

// Course configuration
export const courseConfig = {
  name: "Play Stack",
  nameTh: "Play Stack",
  tagline: "Game Development Online Course",
  taglineTh: "คอร์สพัฒนาเกมออนไลน์",
  description: "From Zero to Pro - Text-based → 2D → 3D Game Development",
  descriptionTh: "จากศูนย์สู่มืออาชีพ - Text-based → 2D → 3D Game Development",
  totalDuration: "6-12 months",
  totalPhases: 5,
  totalModules: 16,
  framework: "Next.js",
  version: "1.0.0",
};

// Learning paths
export const learningPaths = [
  {
    id: "path-2d",
    title: "Web Game Developer (2D Focus)",
    titleTh: "นักพัฒนาเกมเว็บ (เน้น 2D)",
    duration: "4-6 months",
    phases: ["phase-1", "phase-2", "phase-3"],
    goal: "Casual/hypercasual game developer",
    goalTh: "นักพัฒนาเกม Casual/hypercasual",
  },
  {
    id: "path-3d",
    title: "3D Game Developer",
    titleTh: "นักพัฒนาเกม 3D",
    duration: "6-9 months",
    phases: ["phase-1", "phase-2", "phase-4"],
    goal: "3D web game developer",
    goalTh: "นักพัฒนาเกม 3D บนเว็บ",
  },
  {
    id: "path-multiplayer",
    title: "Multiplayer Specialist",
    titleTh: "ผู้เชี่ยวชาญ Multiplayer",
    duration: "5-7 months",
    phases: ["phase-1", "phase-2", "phase-3", "phase-5"],
    goal: "Multiplayer game engineer",
    goalTh: "วิศวกรเกม Multiplayer",
  },
  {
    id: "path-full",
    title: "Full-Stack Game Developer",
    titleTh: "นักพัฒนาเกม Full-Stack",
    duration: "10-12 months",
    phases: ["phase-1", "phase-2", "phase-3", "phase-4", "phase-5"],
    goal: "Senior game developer / indie developer",
    goalTh: "นักพัฒนาเกมอาวุโส / นักพัฒนาเกมอิสระ",
  },
];

// Certificate levels
export const certificates = [
  { id: "cert-foundation", phase: 1, name: "Foundation Certificate", icon: "🥉" },
  { id: "cert-2d", phase: 2, name: "2D Game Developer", icon: "🥈" },
  { id: "cert-multiplayer", phase: 3, name: "Multiplayer Developer", icon: "🥇" },
  { id: "cert-3d", phase: 4, name: "3D Game Developer", icon: "💎" },
  { id: "cert-master", phase: 5, name: "Master Game Developer", icon: "🏆" },
];
