import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
