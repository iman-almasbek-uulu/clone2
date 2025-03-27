"use client";
import LoadScriptPrviders from "@/providers/LoadScriptPrviders";

import ReduxProvider from "@/providers/ReduxProvider";
import { RegionProvider } from "@/providers/RegionProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import React, { FC, ReactNode } from "react";

interface RootLayoutClientProps {
  children: ReactNode;
}
const RootLayoutClient: FC<RootLayoutClientProps> = ({ children }) => {
  return (
    <>

      <ReduxProvider>
        <SessionProvider>
            <LoadScriptPrviders>
              <RegionProvider>{children}</RegionProvider>
            </LoadScriptPrviders>
        </SessionProvider>
      </ReduxProvider>
    </>
  );
};

export default RootLayoutClient;
