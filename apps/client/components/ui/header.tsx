"use client";

import { motion } from "motion/react";
import Button from "./button";
import { FaShapes } from "react-icons/fa6";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <motion.header
      className="sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Logo />
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <motion.a
                key={item}
                className="text-zinc-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button label="Login" variant="ghost" size="sm" />
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" label="Get Started" />
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
