"use client";

import React, { useState } from "react";
import BioManager from "@/components/admin/BioManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import SkillsManager from "@/components/admin/SkillsManager";
import EducationManager from "@/components/admin/EducationManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ContactManager from "@/components/admin/ContactManager";
import SocialsManager from "@/components/admin/SocialsManager";
import BlogManager from "@/components/admin/BlogManager";
import CommentsManager from "@/components/admin/CommentsManager";
import {
  User,
  Briefcase,
  Code,
  GraduationCap,
  Award,
  MessageSquare,
  Mail,
  Share2,
  FileText,
  MessageCircle,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("bio");

  const tabs = [
    { id: "bio", label: "Bio", icon: User },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "experience", label: "Experience", icon: Award },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "contact", label: "Messages", icon: Mail },
    { id: "socials", label: "Socials", icon: Share2 },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "comments", label: "Comments", icon: MessageCircle },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen gap-6">
      <aside className="w-full md:w-64 shrink-0">
        <div className="sticky top-24 space-y-1">
          <h1 className="text-2xl font-bold mb-6 px-4">Admin Dashboard</h1>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        {activeTab === "bio" && <BioManager />}
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "education" && <EducationManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "testimonials" && <TestimonialsManager />}
        {activeTab === "contact" && <ContactManager />}
        {activeTab === "socials" && <SocialsManager />}
        {activeTab === "blog" && <BlogManager />}
        {activeTab === "comments" && <CommentsManager />}
      </main>
    </div>
  );
}
