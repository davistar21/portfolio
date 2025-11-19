"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MouseFollowButton } from "./Footer";
import { ArrowUpRight, Send } from "lucide-react";
import { toast } from "sonner";
export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "2f8ce637-a091-4c6a-af9c-727daec1ae4f");
    // formData.f
    // const formData = {
    //   name: form.name.value,
    //   email: form.email.value,
    //   message: form.message.value,
    // };
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      toast.success("Message sent successfully!");
      form.reset();
    } catch (err) {
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
        className="w-full border border-gray-400/80 text-gray-100/80 placeholder:text-gray-400/80 rounded-lg p-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="w-full border border-gray-400/80 text-gray-100/80 placeholder:text-gray-400/80 rounded-lg p-2"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full border border-gray-400/80 text-gray-100/80 placeholder:text-gray-400/80 rounded-lg p-2"
        rows={5}
        required
      />
      <MouseFollowButton
        disabled={loading}
        className="items-center ml-auto flex gap-2 bg-gray-800 shadow-md rounded-full px-4 md:px-3 py-2 text-base text-gray-400  hover:bg-gray-800/90  hover:text-gray-200 transition-colors"
      >
        {loading ? "Sending..." : "Send Message"} <Send size={14} />
      </MouseFollowButton>
    </form>
  );
}
