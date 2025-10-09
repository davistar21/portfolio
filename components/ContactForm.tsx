"use client";
import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    // formData.f
    // const formData = {
    //   name: form.name.value,
    //   email: form.email.value,
    //   message: form.message.value,
    // };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setStatus("✅ Message sent successfully!");
      form.reset();
    } else {
      setStatus(`❌ ${data.error}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <input
        name="name"
        type="text"
        placeholder="Your Name"
        className="w-full border rounded-lg p-2"
        required
      />
      <input
        name="email"
        type="email"
        placeholder="Your Email"
        className="w-full border rounded-lg p-2"
        required
      />
      <textarea
        name="message"
        placeholder="Your Message"
        className="w-full border rounded-lg p-2"
        rows={5}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90 transition"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
      {status && <p className="text-center">{status}</p>}
    </form>
  );
}
