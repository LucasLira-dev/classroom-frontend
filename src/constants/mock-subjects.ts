// Mock data for university subjects
// Each subject includes: id, code, name, department, description

import { Subject } from "@/types";

export const mockSubjects: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "computer-science",
    description: "Fundamental concepts of computer science, including algorithms, programming, and problem-solving.",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    code: "MATH201",
    name: "Calculus II",
    department: "mathematics",
    description: "A continuation of Calculus I, covering integration techniques, sequences, and series.",
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    code: "PHY150",
    name: "General Physics",
    department: "physics",
    description: "Basic principles of physics, including mechanics, thermodynamics, and waves.",
    createdAt: new Date().toISOString()
  }
];
