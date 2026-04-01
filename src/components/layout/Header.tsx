import Link from "next/link";

export function Header() {
  return (
    <header className="bg-brand text-white shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-brand-accent transition-colors">
          ⚽ Football 2026
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/teams" className="hover:text-brand-accent transition-colors">
            Équipes
          </Link>
        </nav>
      </div>
    </header>
  );
}
