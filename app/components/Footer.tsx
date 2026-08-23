import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto py-6 px-6 md:px-12 bg-[#F3F2EE]/50 border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© 2026 Wall Atelier. Built for thinkers.</p>
        <div className="flex items-center gap-6">
          <Link href="/pro" className="flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700 transition-colors">
            ✨ Pro
          </Link>
          <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          <Link href="#" className="hover:text-black transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
