import LogoMenu from "./LogoMenu";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <LogoMenu />
      </div>
    </header>
  );
}
