"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MouseFollowButton } from "./Footer";
import { ArrowUpRight, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "2f8ce637-a091-4c6a-af9c-727daec1ae4f");

    // Supabase Data
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      // Execute both Web3Forms and Supabase insert in parallel
      const [web3Res, supabaseRes] = await Promise.all([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        }),
        supabase.from("contact_messages").insert([
          {
            name,
            email,
            message,
          },
        ]),
      ]);

      if (supabaseRes.error) {
        console.error("Supabase Error:", supabaseRes.error);
      }

      toast.success("Message sent successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error(`Oops! Failed to send...`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input type="hidden" name="to" value="eyitayobembe@gmail.com" />

      <input
        name="name"
        type="text"
        placeholder="Your Name"
        className="w-full border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-lg p-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="w-full border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-lg p-2"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full border border-input bg-background text-foreground placeholder:text-muted-foreground rounded-lg p-2"
        rows={5}
        required
      />
      <MouseFollowButton
        disabled={loading}
        className="items-center ml-auto flex gap-2 bg-primary shadow-md rounded-full px-4 md:px-3 py-2 text-base text-primary-foreground  hover:bg-primary/90  hover:text-primary-foreground transition-colors"
      >
        {loading ? "Sending..." : "Send Message"} <Send size={14} />
      </MouseFollowButton>
    </form>
  );
}
