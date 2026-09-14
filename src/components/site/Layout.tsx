import type { ReactNode } from "react"; import { SiteHeader } from "./SiteHeader"; import { SiteFooter } from "./SiteFooter";
export function SiteLayout({ children }: { children: ReactNode }) { return <><SiteHeader/><main>{children}</main><SiteFooter/></>; }
