export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing and using this service, you accept and agree to be bound by the terms
            and provision of this agreement. If you do not agree to abide by the above, please
            do not use this service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p className="mb-4">
            Our service provides a collaborative workspace platform that allows users to create,
            edit, and share documents, databases, and other content. The service is provided
            &quot;as is&quot; and we reserve the right to modify or discontinue the service at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="mb-4">
            To use certain features of the service, you must create an account. You are responsible for:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Providing accurate and up-to-date information</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
          <p className="mb-4">
            You agree not to use the service to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Upload malicious code or viruses</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Spam or send unsolicited communications</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Content Ownership</h2>
          <p className="mb-4">
            You retain ownership of content you create and upload to our service. By using our service,
            you grant us a limited license to use, store, and display your content solely for the
            purpose of providing the service to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Privacy</h2>
          <p className="mb-4">
            Your privacy is important to us. Please review our Privacy Policy, which also governs
            your use of the service, to understand our practices.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
          <p className="mb-4">
            We strive to maintain high service availability but cannot guarantee uninterrupted access.
            We may temporarily suspend the service for maintenance, updates, or other operational reasons.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall we be liable for any indirect, incidental, special, consequential,
            or punitive damages, including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right to modify or replace these Terms at any time. If a revision is
            material, we will try to provide at least 30 days notice prior to any new terms taking effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which
            our company is established, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
          <p className="mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mb-4">
            Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'legal@notionclone.com'}
          </p>
        </section>
      </div>
    </div>
  )
}