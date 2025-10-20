"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export function ProgressBarProvider() {
  return (
    <ProgressBar
      color="#516ff0"
      height="3px"
      options={{ showSpinner: false }}
    />
  );
}
