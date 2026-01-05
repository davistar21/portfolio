"use client";

import React, { useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { useProjectsStore } from "@/store/useProjectsStore";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
/* 
  const projects = [
  {
    link: "https://ai-resurne-analyz3r.vercel.app/",
    title: "AI Resume Analyzer",
    img: {
      src: "/ai-resume-analyzer-landing.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "AI-powered resume analysis tool built to give you instant and insightful feedback on your resume",
    tags: [
      "React Router v7",
      "Framer Motion",
      "TailwindCSS",
      "Puter.js",
      "Claude API",
    ],
  },
  {
    link: "https://url-shortener-app-wheat-eight.vercel.app/",
    title: "Shortly",
    img: {
      src: "/url-shortener-ss.png",
      alt: "Shortly - URL Shortener",
    },
    description:
      "A web app that generates short, shareable links from long URLs. Built with a focus on speed and usability, featuring copy-to-clipboard and link analytics.",
    tags: ["React + TS", "TailwindCSS", "CleanURI API"],
  },
  {
    link: "https://weather-app-ruddy-seven-32.vercel.app/",
    title: "Weather Inc.",
    img: {
      src: "/weather-app-page-ss.png",
      alt: "Studently - AI Study Assistant",
    },
    description:
      "A modern weather forecast app using real-time weather data. Get current conditions, hourly and daily forecasts using OpenMeteo API.",
    tags: ["React + TS", "TailwindCSS", "OpenMeteo API"],
  },
  {
    // link: "https://studently-main.vercel.app",
    title: "Studently",
    img: {
      src: "/studently-dashboard.jpeg",
      alt: "Studently - AI Study Assistant",
    },
    description: "All-in-One AI-Powered Study Assistant",
    tags: [
      "React Router v7",
      "TailwindCSS",
      "Zustand",
      "Framer Motion",
      "AWS Amplify",
      "Amazon Cognito",
      "Amazon Lambda",
      "Amazon Bedrock",
      "AWS Textract",
      "Amazon S3",
      "DynamoDB",
      "API Gateway",
      "Amazon CloudWatch",
    ],
  },
  */
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectsProps {
  preview?: boolean;
  initialProjects?: Project[];
}

const Projects = ({ preview = false, initialProjects }: ProjectsProps) => {
  const {
    projects: storeProjects,
    isLoading,
    hasLoaded,
    fetchProjects,
    fetchFeaturedProjects,
  } = useProjectsStore();

  const projects = initialProjects || storeProjects;
  // Only use loading state if we don't have initial data
  const showLoading = !initialProjects && isLoading && !hasLoaded;

  useEffect(() => {
    // If we have initialProjects, we don't strictly need to fetch,
    // but if we want to keep the store in sync or if this is used elsewhere without props:
    if (!initialProjects) {
      if (preview) {
        fetchFeaturedProjects();
      } else {
        fetchProjects();
      }
    }
  }, [fetchProjects, fetchFeaturedProjects, preview, initialProjects]);

  if (showLoading) {
    // ... skeleton logic derived from grid type
    return (
      <div className={cn(preview ? "py-12" : "py-6")} id="projects">
        {/* Same header as before */}
        {preview && (
          <h2 className="font-semibold text-xl md:text-2xl mb-8 flex items-center gap-2">
            {/* <span className="bg-primary/20 text-primary p-1.5 rounded-lg">
              ⚡
            </span> */}
            Featured Projects
          </h2>
        )}
        <div className={cn("grid gap-6 grid-cols-1 md:grid-cols-2")}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl border bg-card p-4 space-y-4"
            >
              <Skeleton className="w-full h-32 rounded-lg" />
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(preview ? "py-12" : "py-6")} id="projects">
      <div className="flex justify-between items-end mb-8">
        {preview && (
          <>
            <h2 className="font-semibold text-xl md:text-2xl flex items-center gap-3">
              {/* <span className="bg-primary/20 text-primary p-2 rounded-xl text-xl">
                ⚡
              </span> */}
              Featured Projects
            </h2>

            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              View All{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </>
        )}
      </div>

      <div
        className={cn(
          "grid gap-6",
          preview
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(300px,auto)]"
        )}
      >
        {projects.map((project, index) => {
          let spanClass = "";

          // Only apply Bento logic if NOT in preview mode
          // if (!preview) {
          //   const isWide = index % 7 === 0 || index % 3 === 0;
          //   const isTall = index % 7 === 3 || index % 5 === 0;
          //   if (isWide) spanClass = "md:col-span-2";
          //   else if (isTall) spanClass = "row-span-2";
          // }

          if (!preview && index < 6) {
            if (index === 0 || index === 3) spanClass = "md:col-span-2";
            // if (index === 2) spanClass = "row-span-2";
          }

          return (
            <motion.div
              key={project.id}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className={spanClass}
            >
              <ProjectCard project={project} />
            </motion.div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 border rounded-xl border-dashed">
          <p className="text-muted-foreground">
            No projects found. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;
