import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, LogIn, UserPlus, Info, Sun, Moon } from "lucide-react";
import Logo from "./Logo";
import { useTheme } from "@/hooks/use-theme";

export default function LogoMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();

  // Close on outside click
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
    navigate("~" + path);
    setOpen(false);
  }

  const isDark = theme === "dark";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center focus:outline-none"
        aria-label="Open menu"
      >
        <Logo variant="kleur" size="full" height={26} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-border bg-popover shadow-lg z-50 py-1 text-popover-foreground">
          <MenuItem icon={<Home size={15} />} label="Home" onClick={() => go("/")} />
          <MenuItem icon={<LogIn size={15} />} label="Inloggen" onClick={() => go("/login")} />
          <MenuItem icon={<UserPlus size={15} />} label="Aanmelden" onClick={() => go("/signup")} />
          <MenuItem icon={<Info size={15} />} label="Over ons" onClick={() => go("/over")} />
          <div className="my-1 border-t border-border" />
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
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
