"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { FC, ReactNode, useRef } from "react";
import { useIsMobile } from "~/hooks/useIsMobile";

import { cn } from "~/lib/utils";

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({
  text,
  className,
}) => {
  const isMobile = useIsMobile();
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Split into paragraphs first
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);

  // Process bold sections and words for each paragraph
  const processedParagraphs = paragraphs.map((paragraph) => {
    const boldSections = paragraph.split("__");
    const words: { word: string; isBold: boolean }[] = [];
    let isBold = false;

    boldSections.forEach((section, index) => {
      const sectionWords = section
        .trim()
        .split(" ")
        .filter((w) => w.length > 0);
      words.push(...sectionWords.map((word) => ({ word, isBold })));
      isBold = !isBold;
    });

    return words;
  });

  const totalWords = processedParagraphs.flat().length;

  if (isMobile) {
    return (
      <div className={cn("relative z-0 py-32", className)}>
        <div className="mx-auto max-w-4xl w-form-sm px-4">
          {processedParagraphs.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              className="flex flex-wrap p-5 text-xl tracking-tight"
            >
              {paragraph.map(({ word, isBold }, i) => (
                <span key={i} className="relative mx-0.5">
                  <span
                    className={cn(
                      isBold
                        ? "font-semibold text-foreground"
                        : "font-medium text-muted-foreground"
                    )}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200dvh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex h-[50%] max-w-4xl flex-col items-center bg-transparent py-[20dvh] w-form-sm md:w-form-md lg:w-form-lg px-4 "
        }
      >
        {processedParagraphs.map((paragraph, pIndex) => {
          const wordsBeforeParagraph = processedParagraphs
            .slice(0, pIndex)
            .flat().length;

          return (
            <p
              key={pIndex}
              className={
                "flex flex-wrap p-5 text-xl text-foreground/20  md:p-8 md:text-xl lg:text-2xl xl:text-3xl tracking-tight lg:ml-[5dvw]"
              }
            >
              {paragraph.map(({ word, isBold }, i) => {
                const wordIndex = wordsBeforeParagraph + i;
                const start = wordIndex / totalWords;
                const end = start + 1 / totalWords;
                return (
                  <Word
                    key={i}
                    progress={scrollYProgress}
                    range={[start, end]}
                    isBold={isBold}
                  >
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
  isBold?: boolean;
}

const Word: FC<WordProps> = ({ children, progress, range, isBold = false }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="xl:lg-3 relative mx-0.5 lg:mx-1">
      <span className={"absolute opacity-30"}>
        <span className={isBold ? "font-semibold" : "font-medium"}>
          {children}
        </span>
      </span>
      <motion.span
        style={{ opacity: opacity }}
        className={cn(
          isBold
            ? "font-semibold text-foreground"
            : "font-medium text-muted-foreground"
        )}
      >
        {children}
      </motion.span>
    </span>
  );
};

export default TextRevealByWord;
