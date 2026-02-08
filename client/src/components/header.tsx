import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/logo";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Mock Tests", href: "/mock-tests" },
  { label: "Classes", href: "/classes" },
  { label: "Resources", href: "/resources" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return "/auth";
    if (user.role === "admin") return "/admin";
    if (user.role === "moderator") return "/moderator";
    if (user.role === "mentor") return "/mentor";
    return "/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between gap-4 px-4">
        <Link href="/" data-testid="link-home-logo">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" data-testid="nav-desktop">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${location === item.href ? "bg-muted font-medium" : "text-muted-foreground"}`}
                data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                      {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">@{user.username}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href={getDashboardPath()}>
                  <DropdownMenuItem data-testid="menu-dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  data-testid="menu-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" className="hidden sm:block">
              <Button size="sm" data-testid="button-signin">
                Sign In
              </Button>
            </Link>
          )}

          <div className="lg:hidden">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-hamburger">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 pt-10">
                <nav className="flex flex-col gap-1">
                  {NAV_ITEMS.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setSheetOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${location === item.href ? "bg-muted font-medium" : "text-muted-foreground"}`}
                        data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                  {!user && (
                    <Link href="/auth" onClick={() => setSheetOpen(false)}>
                      <Button className="w-full mt-4" data-testid="mobile-signin">
                        Sign In
                      </Button>
                    </Link>
                  )}
                  {user && (
                    <>
                      <div className="my-2 border-t" />
                      <Link href={getDashboardPath()} onClick={() => setSheetOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start" data-testid="mobile-dashboard">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive"
                        onClick={() => {
                          logoutMutation.mutate();
                          setSheetOpen(false);
                        }}
                        data-testid="mobile-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
