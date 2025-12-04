"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react";

type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

export default function ContactManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch messages: " + error.message);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const toggleHandled = async (message: ContactMessage) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ handled: !message.handled })
      .eq("id", message.id);

    if (error) {
      toast.error("Failed to update message status: " + error.message);
    } else {
      toast.success("Message status updated");
      fetchMessages();
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 bg-card rounded-lg border shadow-sm ${
              message.handled ? "opacity-70" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{message.name}</h3>
                <a
                  href={`mailto:${message.email}`}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> {message.email}
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(message.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => toggleHandled(message)}
                className={`p-2 rounded-full ${
                  message.handled
                    ? "text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20"
                    : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                title={
                  message.handled ? "Mark as unhandled" : "Mark as handled"
                }
              >
                {message.handled ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5 opacity-50" />
                )}
              </button>
            </div>
            <div className="p-3 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">
              {message.message}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No messages found.
          </div>
        )}
      </div>
    </div>
  );
}
