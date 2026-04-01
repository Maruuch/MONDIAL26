export function Footer() {
  const disclaimer = process.env.NEXT_PUBLIC_DISCLAIMER ?? "Produits fan-made non officiels.";
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm py-8 mt-auto">
      <div className="container mx-auto px-4 text-center space-y-2">
        <p className="text-yellow-400 font-medium">{disclaimer}</p>
        <p>© {new Date().getFullYear()} Football 2026. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
