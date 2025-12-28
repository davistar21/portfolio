import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="font-bold text-xl md:text-2xl tracking-tight group"
    >
      <span className="text-foreground group-hover:text-primary transition-colors">
        Eyitayo
      </span>
      <span className="text-primary">.</span>
    </Link>
  );
};

export default Logo;
