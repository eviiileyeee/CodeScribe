"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CloudUpload } from "lucide-react";

const features = [
  {
    title: "Multi-language Code Conversion",
    description:
      "Seamlessly convert your code between multiple programming languages with high accuracy.",
    pointers: [
      "Supports popular languages like JavaScript, Python, Java, and more",
      "Preserves code structure and logic during conversion",
      "Optimized for both frontend and backend codebases",
    ],
    image: "https://www.nicepng.com/png/full/380-3801129_languages-icon-png.png",
    alt: "Multi-language Code Conversion",
    icon: CloudUpload,
  },
  {
    title: "Syntax and Style Preservation",
    description:
      "Maintain your original code’s syntax and style for readability and consistency.",
    pointers: [
      "Preserves indentation, comments, and formatting",
      "Adapts to your coding style preferences",
      "Ensures converted code is clean and maintainable",
    ],
    image: "https://cdn-icons-png.flaticon.com/512/6214/6214248.png",
    alt: "Syntax and Style Preservation",
    button: "Learn More",
    icon: CloudUpload,
  },
  {
    title: "Fast and Accurate Conversion",
    description:
      "Experience rapid code conversion with minimal errors using AI-powered algorithms.",
    pointers: [
      "Leverages advanced AI models for precision",
      "Handles complex code structures effortlessly",
      "Integrates smoothly with your development workflow",
    ],
    alt: "Fast and Accurate Conversion",
    image: "https://clipground.com/images/adios-multiple-languages-clipart-1.png",
    icon: CloudUpload,
  },
];

const Feature = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-12 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div className="mb-3 w-fit rounded-full border border-purple-600 bg-purple-500/10 px-2 py-0.5 text-xs">
            Features
          </motion.div>
          <motion.h1
            className="mb-4 text-2xl font-semibold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            Powerful features that make your code conversion easier
          </motion.h1>
          <motion.p
            className="max-w-md text-center text-sm text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            Discover the power of our platform with these cutting-edge features
            designed to streamline your workflow and enhance productivity
          </motion.p>
        </motion.div>

        {features.map((feature, index) => (
          <FeatureItem key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  );
};

const FeatureItem = ({ feature, index }: { feature: any; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} mb-12 items-center`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ delay: 0.2 * index, duration: 0.1 }}
    >
      <div className="mb-6 md:mb-0 md:w-1/2 md:px-8">
        <motion.div className="mb-3 shrink-0">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-600">
            <feature.icon aria-hidden="true" className="size-6 text-white" />
          </div>
        </motion.div>
        <motion.h2
          className="mb-2 text-3xl font-semibold"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0.3 + 0.2 * index, duration: 0.1 }}
        >
          {feature.title}
        </motion.h2>
        <motion.p
          className="mb-5 text-gray-600 dark:text-gray-200"
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ delay: 0.4 + 0.2 * index, duration: 0.1 }}
        >
          {feature.description}
        </motion.p>
        <ul className="mb-4 space-y-2">
          {feature.pointers.map((pointer: string, i: number) => (
            <motion.li
              key={i}
              className="flex items-start gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.5 + 0.1 * i + 0.2 * index, duration: 0.1 }}
            >
              <svg
                className="text-purple-600"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
              >
                <path
                  d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M8 11.8571L10.5 14.3572L15.8572 9"
                  stroke="white"
                  strokeWidth="2"
                ></path>
              </svg>
              <span className="text-gray-600 dark:text-gray-300">
                {pointer}
              </span>
            </motion.li>
          ))}
        </ul>
        {feature.button && (
          <motion.button
            className="mt-4 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {feature.button}
          </motion.button>
        )}
      </div>
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ delay: 0.6 + 0.2 * index, duration: 0.1 }}
      >
        <img
          src={feature.image}
          alt={feature.alt}
          className="w-full rounded-lg object-cover"
        />
      </motion.div>
    </motion.div>
  );
};

export default Feature;
