import Link from "next/link";
import { GraduationCap, LogOut } from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { NavLinks, type NavItem } from "@/components/nav-links";

// WHY: one header + page frame for all 3 roles. Mobile first.
export function AppShell(props: {
  name: string;
  roleLabel: string;
  links: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </span>
            CampusConnect
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="font-medium">{props.name}</p>
              <p className="text-muted-foreground">{props.roleLabel}</p>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="outline" size="sm" aria-label="Sign out">
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </div>
        <NavLinks links={props.links} />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{props.children}</main>
    </div>
  );
}