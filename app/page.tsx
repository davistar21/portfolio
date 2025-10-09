// "use client";
import React from "react";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Education from "@/Education";
import WorkExperience from "@/components/WorkExperience";

export default function HomePage() {
  return (
    <section className="flex flex-col gap-24 mt-8 md:px-8 px-4">
      <Hero />
      <Projects />
      <Education />
      <WorkExperience />
    </section>
  );
}
