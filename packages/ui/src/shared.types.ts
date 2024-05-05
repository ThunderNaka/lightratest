export const SIZE = {
  SMALL: "sm",
  MEDIUM: "md",
  LARGE: "lg",
} as const;

export type Size = (typeof SIZE)[keyof typeof SIZE];
