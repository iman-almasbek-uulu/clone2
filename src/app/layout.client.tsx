"use client";
import LoadScriptPrviders from "@/providers/LoadScriptPrviders";
// import ProtectProvider from "@/providers/ProtectProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import { RegionProvider } from "@/providers/RegionProvider";
import { SessionProvider } from "@/providers/SessionProvider";
// import { Session } from "next-auth";
import React, { FC, ReactNode } from "react";
// import { BrowserRouter } from "react-router-dom";

interface RootLayoutClientProps {
  children: ReactNode;
  // session: Session | null;
}
const RootLayoutClient: FC<RootLayoutClientProps> = ({ children }) => {
  return (
    <>
      {/* <BrowserRouter> */}
        <ReduxProvider>
          <SessionProvider>
            {/* <ProtectProvider> */}
            <LoadScriptPrviders>
              <RegionProvider>{children}</RegionProvider>
            </LoadScriptPrviders>
            {/* </ProtectProvider> */}
          </SessionProvider>
        </ReduxProvider>
      {/* </BrowserRouter> */}
    </>
  );
};

export default RootLayoutClient;
