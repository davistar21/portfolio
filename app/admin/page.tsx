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
  Menu,
  X,
} from "lucide-react";

import { Session } from "@supabase/supabase-js";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import ErrorComponent from "@/components/Error";

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bio");
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const resetFn = () => {
    if (window !== undefined) {
      return window.location.reload();
    } else return () => {};
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [activeTab, isMobile]);
  useEffect(() => {
    const fetchSessionWithTimeout = async () => {
      try {
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => {
            reject(
              new Error(
                "Network timeout: Failed to fetch session within 10 seconds."
              )
            );
          }, 10000)
        );

        // Race the timeout promise against the Supabase session fetch
        const sessionPromise = supabase.auth.getSession();

        const {
          data: { session },
        } = await Promise.race([sessionPromise, timeoutPromise]);

        setSession(session);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching session:", err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchSessionWithTimeout();

    // Subscribe to auth state changes as usual
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  useEffect(() => {
    // async function runAI() {
    //   const res = await fetch("/api/generate", {
    //     method: "POST",
    //     body: JSON.stringify({ prompt: "What is love?" }),
    //   });
    //   if (!res.body) {
    //     console.error("No response body");
    //     return;
    //   }
    //   const reader = res.body.getReader();
    //   const decoder = new TextDecoder();
    //   while (true) {
    //     const { value, done } =
    //       (await reader.read()) as ReadableStreamReadResult<Uint8Array>;
    //     if (done) break;
    //     console.log(decoder.decode(value));
    //   }
    // }
    // runAI();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span>Loading...</span>
      </div>
    );
  }
  if (error) {
    return <ErrorComponent error={error} reset={resetFn} />;
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
    <div className="flex md:flex-row min-h-screen gap-6">
      <AnimatePresence mode="wait">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-3 left-3 z-[9999] cursor-pointer"
        >
          <motion.div
            key={isSidebarOpen ? "open" : "closed"}
            initial={{ x: "-10%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-10%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.div>
        </button>
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden block fixed z-[49] bg-black/50 inset-0"
            onClick={() => setIsSidebarOpen(false)}
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 left-0 h-full w-64 bg-background shadow-md z-50 p-4 rounded-lg"
          >
            <div className="space-y-1 flex flex-col h-[90vh] mt-8">
              <h1 className="text-2xl font-bold mb-6 px-2">My Dashboard</h1>

              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}

              <div className="mt-auto pt-4 border-t">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-destructive/10 text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
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
      </AnimatePresence>
    </div>
  );
}
