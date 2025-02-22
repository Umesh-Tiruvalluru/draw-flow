"use client";

import { motion } from "motion/react";
import Button from "./button";
import { FaUsers } from "react-icons/fa";
import { BiShare } from "react-icons/bi";

export default function Hero() {
  return (
    <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Visualize Your Ideas
            </span>
            <br />
            <span className="text-gray-900">With Infinite Canvas</span>
          </h1>
          <motion.p
            className="mt-6 text-xl text-zinc-500 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Create, collaborate, and bring your ideas to life with our intuitive
            drawing tool. Perfect for brainstorming, diagrams, and visual
            communication.
          </motion.p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button variant="primary" size="lg" label="Start Drawing Now" />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-20 relative"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80"
              alt="DrawFlow Interface Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {[
              { icon: FaUsers, text: "Real-time Collaboration" },
              { icon: BiShare, text: "Easy Sharing" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-2"
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
              >
                <item.icon className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
