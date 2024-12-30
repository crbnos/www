"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { FC, ReactNode, useRef } from "react";

import { cn } from "~/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
}) => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Split into paragraphs first, then words
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);
  const allWords = paragraphs.map((p) => p.split(" "));
  const totalWords = allWords.flat().length;

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl flex-col items-center bg-transparent px-[1rem] py-[20dvh] w-[360px] md:w-[580px] lg:w-[680px] text-xl md:text-2xl"
        }
      >
        {paragraphs.map((paragraph, pIndex) => {
          const words = allWords[pIndex];
          const wordsBeforeParagraph = allWords.slice(0, pIndex).flat().length;

          return (
            <p
              key={pIndex}
              className={
                "flex flex-wrap p-5 text-xl font-bold text-black/20 dark:text-white/20 md:p-8 md:text-2xl lg:p-10 lg:text-3xl"
              }
            >
              {words.map((word, i) => {
                const wordIndex = wordsBeforeParagraph + i;
                const start = wordIndex / totalWords;
                const end = start + 1 / totalWords;
                return (
                  <Word key={i} progress={scrollYProgress} range={[start, end]}>
                    {word}
                  </Word>
                );
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-0.5 lg:mx-1">
      <span className={"absolute opacity-30"}>{children}</span>
      <motion.span
        style={{ opacity: opacity }}
        className={"text-black dark:text-white"}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextRevealByWord;
