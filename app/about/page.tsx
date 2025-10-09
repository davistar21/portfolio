import React from "react";
export const metadata = {
  title: "About — Eyitayo",
  description: "About me — my skills, experience and approach.",
};
export default function AboutPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">About me</h1>
      <p>
        I’m a frontend developer who likes to make interfaces that feel fast and
        polished. I’m currently focusing on React, Next.js and design systems.
      </p>
      <h2 className="text-2xl font-semibold">Skills</h2>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <li className="p-3 rounded-md border">React</li>
        <li className="p-3 rounded-md border">TypeScript</li>
        <li className="p-3 rounded-md border">TailwindCSS</li>
        <li className="p-3 rounded-md border">Framer Motion</li>
        <li className="p-3 rounded-md border">Accessibility</li>
      </ul>
    </section>
  );
}
