"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Login from "@/components/admin/Login";
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
  LogOut,
  Loader2,
} from "lucide-react";

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bio");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    console.log("session", session);
    return <Login onLogin={() => {}} />;
  }

  if (session.user.email !== "eyitayobembe@gmail.com") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-destructive">
            Unauthorized Access
          </h1>
          <p className="text-muted-foreground">
            You are logged in as {session.user.email}, but you do not have
            permission to view this page.
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    );
  }

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
          <div className="pt-4 mt-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-destructive/10 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
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
