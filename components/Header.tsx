"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  return (
    <div className="relative">
      <div className="absolute right-0 top-6">
        <button
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="cursor-pointer flex items-center justify-center p-2 rounded-md transition ml-auto"
        >
          <motion.div
            initial={false}
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {menuOpen ? (
              <X size={20} className="" />
            ) : (
              <Menu size={20} className="" />
            )}
          </motion.div>
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden rounded-lg border border-gray-500 bg-gray-900/90 min-w-[180px]"
            >
              <motion.ul
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                  },
                  hidden: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
                className="flex flex-col gap-4 py-6 px-4 items-center"
              >
                {headerLinks.map((link, i) => (
                  <motion.li
                    key={i}
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: -10 },
                    }}
                  >
                    <HeaderLink {...link} mobile />
                  </motion.li>
                ))}
                <div className="w-full h-px bg-gray-400"></div>
                <motion.li
                  variants={{
                    visible: { opacity: 1, y: 0 },
                    hidden: { opacity: 0, y: -10 },
                  }}
                  className="w-full flex items-center justify-center"
                >
                  <Link
                    href="/#connect"
                    className="text-gray-200 hover:text-gray-400 rounded-2xl text-center font-semibold transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Connect
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Header;

type LinkProp = {
  name: React.ReactNode;
  href: string;
};

const headerLinks: LinkProp[] = [
  { name: "Home", href: "/" },
  { name: "Projects", href: "/#projects" },
  { name: "Blog", href: "/blog" },
];

const HeaderLink: React.FC<
  LinkProp & { mobile?: boolean; isScrolled?: boolean }
> = ({ name, href }) => {
  const onPage = location.pathname === href;
  return (
    <a
      href={href}
      className="group relative text-gray-200 hover:text-gray-400 rounded-2xl text-center font-semibold transition-colors"
    >
      <AnimatePresence>
        {onPage && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.8 }}
            className={`transition-colors absolute w-full h-px rounded-full bottom-0 left-0 bg-gray-200`}
          ></motion.div>
        )}
      </AnimatePresence>
      {name}
    </a>
  );
};
