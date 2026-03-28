import { useState, useRef, useEffect } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import { Home, LogIn, UserPlus, Info, Sun, Moon, LayoutDashboard, Menu } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { isAuthenticated } from "@/lib/auth";

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [, navigate] = useHashLocation();
  const { theme, setTheme } = useTheme();
  const authed = isAuthenticated();

  const isDark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function go(path: string) {
    navigate(path);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-9 h-9 rounded-md hover:bg-accent transition-colors focus:outline-none"
        aria-label="Menu openen"
        aria-expanded={open}
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-popover shadow-lg z-50 py-1 text-popover-foreground">
          {authed ? (
            <MenuItem
              icon={<LayoutDashboard size={15} />}
              label="App"
              onClick={() => go("/app")}
            />
          ) : (
            <>
              <MenuItem icon={<Home size={15} />} label="Home" onClick={() => go("/")} />
              <MenuItem icon={<LogIn size={15} />} label="Inloggen" onClick={() => go("/login")} />
              <MenuItem icon={<UserPlus size={15} />} label="Aanmelden" onClick={() => go("/signup")} />
            </>
          )}
          <MenuItem icon={<Info size={15} />} label="Over ons" onClick={() => go("/over")} />
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => {
              setTheme(isDark ? "light" : "dark");
              setOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
            {isDark ? "Lichte modus" : "Donkere modus"}
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
    >
      {icon}
      {label}
    </button>
  );
}
