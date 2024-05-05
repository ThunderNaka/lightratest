import { useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { fetchImages } from "@lightit/shared";

import { ScreenLoading } from "~/components";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01,
    },
  },
};

const listItem = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const Image = ({
  source,
  constraints,
}: {
  source: string;
  constraints: RefObject<Element>;
}) => (
  <motion.img
    variants={listItem}
    style={{
      width: document?.body.clientWidth / 12,
      height: document?.body.clientHeight / 6,
    }}
    drag
    dragConstraints={constraints}
    src={source}
  />
);

export const Background = ({ children }: { children: ReactNode }) => {
  const constraintsRef = useRef(null);
  const { data: images, isLoading } = useQuery({
    queryKey: ["login-images"],
    queryFn: fetchImages,
    staleTime: 60 * 60 * 1000 * 24,
    cacheTime: 60 * 60 * 1000 * 24,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <ScreenLoading
        className="bg-nostalgia-purple-600"
        loadingProps="text-white"
      />
    );
  }

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-primary-700 bg-center">
      <motion.div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
        }}
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap"
        ref={constraintsRef}
      >
        {images?.map((image, idx) => (
          <Image key={idx} source={image} constraints={constraintsRef} />
        ))}
      </motion.div>
      {children}
    </div>
  );
};
