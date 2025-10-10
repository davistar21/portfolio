"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MouseFollowButton } from "./Footer";
import { ArrowUpRight, Send } from "lucide-react";
export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("access_key", "2f8ce637-a091-4c6a-af9c-727daec1ae4f");
    // formData.f
    // const formData = {
    //   name: form.name.value,
    //   email: form.email.value,
    //   message: form.message.value,
    // };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus("✅ Message sent successfully!");
      setTimeout(() => {
        setStatus(null);
      }, 1000);
      form.reset();
    } else {
      setStatus(`❌ ${data.error}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input type="hidden" name="to" value="eyitayobembe@gmail.com" />

      <input
        name="name"
        type="text"
        placeholder="Your Name"
        className="w-full border border-gray-400/80 text-gray-400/80 placeholder:text-gray-400/80 rounded-lg p-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="w-full border border-gray-400/80 text-gray-400/80 placeholder:text-gray-400/80 rounded-lg p-2"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full border border-gray-400/80 text-gray-400/80 placeholder:text-gray-400/80 rounded-lg p-2"
        rows={5}
        required
      />
      <MouseFollowButton className="items-center ml-auto flex gap-2 bg-gray-800 shadow-md rounded-full px-4 md:px-3 py-2 text-lg text-gray-400  hover:bg-gray-800/90  hover:text-gray-200 transition-colors">
        {loading ? "Sending..." : "Send Message"} <Send size={16} />
      </MouseFollowButton>
      {status && (
        <motion.p
          initial={{
            y: 30,
            opacity: 0,
          }}
          whileInView={{
            y: 0,
            opacity: 1,
          }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {status}
        </motion.p>
      )}
    </form>
  );
}
