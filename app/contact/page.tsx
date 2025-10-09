import React from "react";
export const metadata = {
  title: "Contact — Eyitayo",
  description: "Get in touch with me.",
};

export default function ContactPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-2">
        Want to work together? Send me an email at{" "}
        <a className="underline" href="mailto:hello@example.com">
          hello@example.com
        </a>
      </p>

      <form className="mt-6 grid grid-cols-1 gap-4 max-w-md">
        <input className="p-3 border rounded-md" placeholder="Your name" />
        <input className="p-3 border rounded-md" placeholder="Email" />
        <textarea
          className="p-3 border rounded-md"
          placeholder="Message"
          rows={6}
        />
        <button className="px-4 py-2 rounded-md text-white">Send</button>
      </form>
    </section>
  );
}
