import { motion, MotionValue } from "framer-motion";
import React from "react";

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
      }}
      className="mx-auto -mt-12 h-auto w-full max-w-5xl rounded-[30px]"
    >
      <div className="relative mx-auto w-full rounded-[32px] border border-neutral-300 bg-neutral-200 p-2 opacity-100 backdrop-blur-lg will-change-auto dark:border-neutral-700 dark:bg-neutral-800/50 md:p-4">
        {children}
      </div>
    </motion.div>
  );
}; 