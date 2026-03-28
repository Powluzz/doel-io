import Logo from "./Logo";
import HamburgerMenu from "./HamburgerMenu";
import { useHashLocation } from "wouter/use-hash-location";
import { isAuthenticated } from "@/lib/auth";
import { useTheme } from "@/hooks/use-theme";

export default function AppHeader() {
  const [, navigate] = useHashLocation();
  const { theme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  function handleLogoClick() {
    navigate(isAuthenticated() ? "/app" : "/");
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={handleLogoClick}
          className="flex items-center focus:outline-none"
          aria-label="Naar startpagina"
        >
          <Logo variant={isDark ? "wit" : "zwart"} size="full" height={26} />
        </button>
        <HamburgerMenu />
      </div>
    </header>
  );
}
