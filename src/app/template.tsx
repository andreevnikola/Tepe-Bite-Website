"use client";

import { ViewTransition } from "react";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransition
      name="page-content"
      enter="page-switch"
      exit="page-switch"
      share="page-switch"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
