import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { tw } from "@lightit/shared";

import { Tab } from "./Tab";

export interface TabsProps<TTab extends string, TTabValue extends TTab>
  extends Omit<ComponentPropsWithoutRef<"nav">, "onChange" | "value"> {
  tabs: readonly TTab[] | TTab[];
  value: TTabValue;
  tabClassName?: string;
  onChange: (tab: TTab) => void;
  renderTab?: (params: {
    tab: TTab;
    onClick: () => void;
    selected: boolean;
  }) => ReactNode;
}

export const Tabs = <TTab extends string, TTabValue extends TTab>({
  tabs,
  className,
  tabClassName,
  value,
  onChange,
  renderTab,
  ...props
}: TabsProps<TTab, TTabValue>) => (
  <nav aria-label="Tabs" {...props} className={tw("flex flex-row", className)}>
    {tabs.map((tab) =>
      renderTab ? (
        renderTab({
          tab,
          onClick: () => onChange(tab),
          selected: tab === value,
        })
      ) : (
        <Tab
          key={tab}
          value={tab}
          isSelected={tab === value}
          onClick={() => onChange(tab)}
          className={tabClassName}
        />
      ),
    )}
  </nav>
);
