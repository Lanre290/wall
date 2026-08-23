import Link from "next/link";
import { getSessionUser } from "../../lib/auth";
import { User as DbUser } from "../../lib/sequelize";

export async function Footer() {
  const session = await getSessionUser();
  let isPro = false;
  
  if (session) {
    const user = await DbUser.findByPk(session.userId);
    if (user?.getDataValue('plan') === 'PRO') {
      isPro = true;
    }
  }

  return (
    <footer className="mt-auto py-6 px-6 md:px-12 bg-[#F3F2EE]/50 border-t border-gray-200/50 pb-24 md:pb-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
        <p>© 2026 Wall Atelier. Built for thinkers.</p>
        <div className="flex items-center gap-6">
          {!isPro && (
            <Link href="/pro" className="flex items-center gap-1 font-medium text-amber-600 hover:text-amber-700 transition-colors">
              ✨ Pro
            </Link>
          )}
          <Link href="#" className="hover:text-black transition-colors">Terms</Link>
          <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
