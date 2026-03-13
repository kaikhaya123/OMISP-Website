import dynamic from "next/dynamic";
import type { ComponentType } from "react";

export const clientPage = <Props,>(
  loader: () => Promise<{ default: ComponentType<Props> }>,
) => dynamic(loader, { ssr: false });