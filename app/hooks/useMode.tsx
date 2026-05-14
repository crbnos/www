import { useFetchers } from "react-router";
import { useSyncExternalStore } from "react";

import type { Mode } from "~/types/validators";
import { modeValidator } from "~/types/validators";
import { path } from "~/utils/path";
import { useRouteData } from "./useRouteData";

// Client-side store for instant mode updates (bypasses fetcher round-trip)
let _clientMode: Mode | null = null;
const _listeners = new Set<() => void>();

export function setClientMode(mode: Mode) {
  _clientMode = mode;
  for (const l of _listeners) l();
}

function subscribe(callback: () => void) {
  _listeners.add(callback);
  return () => {
    _listeners.delete(callback);
  };
}

function getClientMode() {
  return _clientMode;
}

export function useOptimisticMode() {
  const fetchers = useFetchers();
  const modeFetcher = fetchers.find((f) => f.formAction === "/");

  if (modeFetcher && modeFetcher.formData) {
    const mode = { mode: modeFetcher.formData.get("mode") };
    const submission = modeValidator.safeParse(mode);

    if (submission.success) {
      return submission.data.mode;
    }
  }
}

export function useMode() {
  const clientMode = useSyncExternalStore(subscribe, getClientMode, () => null);
  const optimisticMode = useOptimisticMode();
  const routeData = useRouteData<{ mode: Mode }>(path.to.root);

  if (clientMode) return clientMode;

  let mode = routeData?.mode ?? "light";

  if (optimisticMode && optimisticMode !== "system") {
    mode = optimisticMode;
  }

  return mode;
}
