import * as React from "react";
import { useRevalidator } from "react-router";
import { useRouteData } from "~/hooks/useRouteData";
import {
  ClientHint,
  clientHint as colorSchemeHint,
  getHintUtils,
  subscribeToSchemeChange,
} from "~/utils/client-hints";

const hintsUtils = getHintUtils({
  theme: colorSchemeHint,
});

export const { getHints } = hintsUtils;

export function useHints() {
  const routeData = useRouteData<{
    hints: ClientHint<"dark" | "light">;
  }>("/");
  return routeData?.hints;
}

export function ClientHintCheck() {
  const { revalidate } = useRevalidator();
  React.useEffect(
    () => subscribeToSchemeChange(() => revalidate()),
    [revalidate]
  );

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: hintsUtils.getClientHintCheckScript(),
      }}
    />
  );
}
