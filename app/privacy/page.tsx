export const metadata = {
  title: 'Privacy Policy — Wall',
  description: 'How Wall collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F6F5F2] py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-playfair text-4xl font-bold text-[#111] mb-2">Privacy Policy</h1>
        <p className="text-gray-500 text-sm mb-12">Last updated: August 2025</p>

        <div className="flex flex-col gap-10 text-gray-700 text-[15px] leading-relaxed">

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">1. Overview</h2>
            <p>
              Wall (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a platform that lets people create anonymous message boards — walls — where anyone can leave a note. We take your privacy seriously. This policy explains what data we collect, why we collect it, and how it is used.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">2. Data We Collect</h2>
            <p className="mb-4">We collect two types of data:</p>
            <h3 className="font-semibold text-[#111] mb-2">a) Account Information</h3>
            <p className="mb-4">
              When you create an account, we store your name and email address. This is used to identify you as a wall creator and to manage your subscription.
            </p>
            <h3 className="font-semibold text-[#111] mb-2">b) Note Submission Metadata</h3>
            <p>
              When anyone — including anonymous visitors — submits a note to a wall, we automatically collect and store the following alongside the note:
            </p>
            <ul className="list-disc list-inside mt-3 flex flex-col gap-2 pl-2">
              <li><span className="font-medium text-[#111]">IP Address</span> — the network address of the device used to submit the note.</li>
              <li><span className="font-medium text-[#111]">Approximate Location</span> — city and country derived from the IP address via Vercel&apos;s infrastructure.</li>
              <li><span className="font-medium text-[#111]">Geographic Coordinates</span> — latitude and longitude inferred from the IP address (not GPS; accuracy varies by network).</li>
              <li><span className="font-medium text-[#111]">Device Type &amp; Model</span> — e.g. iPhone, Android phone, or Desktop, parsed from the browser&apos;s User-Agent string.</li>
              <li><span className="font-medium text-[#111]">Operating System</span> — e.g. iOS, Android, Windows, macOS.</li>
              <li><span className="font-medium text-[#111]">Browser</span> — e.g. Safari, Chrome, Firefox.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">3. Why We Collect Submission Metadata</h2>
            <p>
              This metadata exists solely to support the <span className="font-medium text-[#111]">&quot;Who sent this?&quot;</span> feature, which is available exclusively to verified wall creators on the Pro plan. It allows creators to gain insight into who is leaving notes on their wall — for example, to identify harassment or spam, or to understand their audience.
            </p>
            <p className="mt-3">
              This data is <span className="font-medium text-[#111]">never sold, shared with third parties, or used for advertising</span>. It is only ever visible to the creator of the specific wall the note was submitted to, and only if they are a Pro subscriber.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">4. No Explicit Location Permission</h2>
            <p>
              We do not use GPS or request browser permissions to collect location data. Location is derived passively from your IP address, which is sent automatically by your browser with every web request. No separate permission dialog is shown. By submitting a note to any wall on this platform, you acknowledge and agree that this metadata is collected as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">5. Data Retention</h2>
            <p>
              Submission metadata is retained for as long as the note exists on the wall. If a note is deleted by the wall creator or by us (e.g. due to a policy violation), the associated metadata is also deleted.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">6. Cookies &amp; Authentication</h2>
            <p>
              If you create an account, we store a secure HTTP-only authentication cookie in your browser. This cookie contains a signed token used to identify your session. It does not track you across other websites and expires when you log out.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">7. Your Rights</h2>
            <p>
              Depending on where you are located, you may have the right to request access to, correction of, or deletion of your personal data. To make such a request, contact us at the email below. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">8. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. Continued use of Wall after changes are posted constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-playfair text-xl font-bold text-[#111] mb-3">9. Contact</h2>
            <p>
              If you have any questions about this Privacy Policy, you can reach us at{' '}
              <a href="mailto:privacy@wall.co" className="text-amber-700 underline">privacy@wall.co</a>.
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

