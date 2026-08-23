export const metadata = {
  title: 'Terms of Service — Wall',
  description: 'Rules and guidelines for using Wall.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F2] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-playfair text-4xl font-bold text-[#111] mb-2">Terms of Service</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: August 2026</p>

        <div className="flex flex-col gap-10 text-gray-700 text-[15px] leading-relaxed">

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">1. What Wall Is</h2>
            <p>
              Wall is a collaborative space where people can create walls and leave anonymous or named sticky notes on them. It is built for connection, memory, and expression — not for commercial data harvesting.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">2. Your Notes</h2>
            <p>
              You own what you write. By posting a note, you grant Wall a limited licence to display it on the wall it was posted to. We do not sell, license, or redistribute your content to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">3. Acceptable Use</h2>
            <p>
              You agree not to post content that is abusive, hateful, threatening, sexually explicit, or otherwise harmful. Wall reserves the right to remove any content that violates these guidelines without prior notice.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">4. Anonymous Notes</h2>
            <p>
              When you post anonymously, your name is not displayed. However, your account ID is still stored internally and may be used to moderate harmful content if necessary.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">5. Wall Creators</h2>
            <p>
              If you create a wall, you are responsible for the content posted on it. You may set a wall to Private or Public at any time. Deleting a wall permanently removes all associated notes.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">6. Changes</h2>
            <p>
              We may update these terms as Wall evolves. Continued use of the platform means you accept any updated terms.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Wall. All rights reserved.
        </div>
      </div>
    </main>
  );
}
