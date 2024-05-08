export interface IIconWrapper {
  size: IconSize;
  desktop?: IconSize;
  children: React.ReactNode;
  ariaLabel?: string;
  ariaHidden?: boolean;
}

export type IconSize = 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 60 | 72;
