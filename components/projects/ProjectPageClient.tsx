"use client";

import React from "react";
import { ArrowLeft, Github, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import MarkdownImage from "@/components/blog/MarkdownImage";
import MarkdownErrorBoundary from "@/components/MarkdownErrorBoundary";
import { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"] & {
  project_images?: Database["public"]["Tables"]["project_images"]["Row"][];
};

interface ProjectPageClientProps {
  project: Project;
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
  // Use the sorted images
  const images =
    project.project_images?.sort((a, b) => a.order_index - b.order_index) || [];
  const heroImage = images.length > 0 ? images[0].image_url : null;
  const galleryImages = images.length > 1 ? images.slice(1) : [];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero / Slideshow Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full bg-muted overflow-hidden rounded-lg">
        {heroImage && (
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full"
          >
            <img
              src={heroImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        )}

        <div className="absolute top-24 left-0 w-full px-4 md:px-12 container mx-auto z-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors bg-black/20 p-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Projects
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-background to-transparent pt-32">
          <div className="container mx-auto max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-primary drop-shadow-md"
            >
              {project.title}
            </motion.h1>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium border border-primary/20 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl mt-8">
        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-12 border-b pb-8">
          {project.project_url && (
            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-transform hover:-translate-y-0.5"
            >
              <Globe className="w-5 h-5" /> Visit Live App
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 border bg-card hover:bg-muted rounded-lg font-medium transition-transform hover:-translate-y-0.5"
            >
              <Github className="w-5 h-5" /> View Source Code
            </a>
          )}
        </div>

        {/* Description */}
        <div className="grid grid-cols-1 gap-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold mb-4">About the Project</h2>
            <MarkdownErrorBoundary>
              <ReactMarkdown
                components={{
                  img: MarkdownImage,
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-primary underline hover:text-primary/80"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  ),
                }}
              >
                {project.description || "No description provided."}
              </ReactMarkdown>
            </MarkdownErrorBoundary>
          </div>

          {/* Gallery (if extra images exist) */}
          {galleryImages.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Gallery</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl overflow-hidden border shadow-sm group"
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Project image ${idx + 2}`}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
