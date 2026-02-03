import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownImage from "@/components/blog/MarkdownImage";
import MarkdownErrorBoundary from "@/components/MarkdownErrorBoundary";
import { Database } from "@/types/supabase";
import { chat } from "@/lib/chat";
import { Sparkles, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

interface ProjectDescriptionEditorProps {
  formData: Partial<ProjectInsert>;
  setFormData: (data: Partial<ProjectInsert>) => void;
  projectId?: string | null;
}

const AI_PROMPT = `You are a technical writer helping showcase portfolio projects. Given a project's README content, generate a compelling project description with metrics.

OUTPUT FORMAT (JSON):
{
  "description": "A 4-5 sentence paragraph describing what the project does, its purpose, and key features. Write in third person, professional tone. Do NOT use bullet points.",
  "techStack": {
    "Frontend": ["Next.js", "React", "TailwindCSS"],
    "Backend": ["Node.js", "Express"],
    "Database": ["PostgreSQL", "Supabase"],
    "AI": ["Groq", "Claude"],
    "Other": ["Docker", "AWS"]
  },
  "metrics": "2-5 sentences highlighting realistic, project-appropriate metrics. These could include: time saved, scale/reach, efficiency gains, performance improvements, user engagement stats, or other quantifiable impacts. Write as flowing prose, not bullets. Make them believable and contextual to the project type."
}

RULES:
- Only include tech stack categories that apply (omit empty ones)
- Be specific about technologies mentioned in the README
- The description should be engaging and highlight the project's value
- For metrics: if it's an automation tool, mention time saved; if it's a platform, mention scale/reach; if it's a dev tool, mention efficiency gains. Be realistic and honest.
- Return ONLY valid JSON, no markdown code blocks`;

const ProjectDescriptionEditor = ({
  formData,
  setFormData,
  projectId,
}: ProjectDescriptionEditorProps) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Use localStorage for README content persistence
  const [readmeContent, setReadmeContent, clearReadmeContent] =
    useLocalStorageState(`admin-project-readme-${projectId || "new"}`, "");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const handleGenerateDescription = async () => {
    if (!readmeContent.trim()) {
      toast.error("Please paste your README content first");
      return;
    }

    setIsGenerating(true);
    try {
      const result = await chat(
        `${AI_PROMPT}\n\nREADME CONTENT:\n${readmeContent}`,
      );

      const { description, techStack, metrics } = result as {
        description: string;
        techStack: Record<string, string[]>;
        metrics: string;
      };

      // Format the tech stack as markdown
      let techStackMarkdown = "\n\n---\n\n**Tech Stack**\n";
      for (const [category, technologies] of Object.entries(techStack)) {
        if (technologies && technologies.length > 0) {
          techStackMarkdown += `\n- **${category}:** ${technologies.join(", ")}`;
        }
      }

      // Add metrics section
      const metricsMarkdown = metrics ? `\n\n---\n\n${metrics}` : "";

      const fullDescription = description + techStackMarkdown + metricsMarkdown;

      setFormData({
        ...formData,
        description: fullDescription,
      });

      toast.success("Description generated successfully!");
      setActiveTab("preview");
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error(
        "Failed to generate description: " +
          (error instanceof Error ? error.message : "Unknown error"),
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="md:col-span-2 space-y-4">
      {/* AI Generation Panel */}
      <div className="border rounded-md bg-gradient-to-r from-primary/5 to-secondary/5">
        <button
          type="button"
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-muted/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            AI Description Generator
          </span>
          {showAIPanel ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showAIPanel && (
          <div className="p-4 pt-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              Paste your project&apos;s README content below and let AI generate
              a polished description with tech stack.
            </p>
            <textarea
              className="w-full p-3 min-h-[120px] bg-background border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-xs"
              placeholder="Paste your README.md content here..."
              value={readmeContent}
              onChange={(e) => setReadmeContent(e.target.value)}
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={isGenerating || !readmeContent.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Description
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Description Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Description (Markdown)
        </label>

        <div className="border rounded-md bg-background">
          <div className="flex items-center gap-2 border-b bg-muted/40 p-2">
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "write"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted-foreground/10 text-muted-foreground"
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === "preview"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-muted-foreground/10 text-muted-foreground"
              }`}
            >
              Preview
            </button>
            <span className="ml-auto text-xs text-muted-foreground">
              Markdown Supported
            </span>
          </div>

          {activeTab === "write" ? (
            <textarea
              className="w-full p-4 min-h-[200px] bg-transparent resize-y focus:outline-none font-mono text-sm"
              placeholder="Describe your project..."
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          ) : (
            <div className="p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none overflow-auto">
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
                  {formData.description || "*No description*"}
                </ReactMarkdown>
              </MarkdownErrorBoundary>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDescriptionEditor;
