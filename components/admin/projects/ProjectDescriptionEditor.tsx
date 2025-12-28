import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import MarkdownImage from "@/components/blog/MarkdownImage";
import MarkdownErrorBoundary from "@/components/MarkdownErrorBoundary";
import { Database } from "@/types/supabase";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

interface ProjectDescriptionEditorProps {
  formData: Partial<ProjectInsert>;
  setFormData: (data: Partial<ProjectInsert>) => void;
}

const ProjectDescriptionEditor = ({
  formData,
  setFormData,
}: ProjectDescriptionEditorProps) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  return (
    <div className="md:col-span-2 space-y-2">
      <label className="block text-sm font-medium">
        Description (Markdown)
      </label>

      {/* Markdown Editor Tabs */}
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
                }}
              >
                {formData.description || "*No description*"}
              </ReactMarkdown>
            </MarkdownErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescriptionEditor;
