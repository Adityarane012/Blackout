import { LegalLayout } from "@/components/legal/legal-layout"
import { Link as LinkIcon } from "lucide-react"

export const metadata = {
  title: "Privacy Policy | BLACKOUT",
  description: "How we collect, use, and protect your data."
}

const privacySections = [
  { id: "overview", title: "1. Overview" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "architecture-data-handling", title: "3. Architecture Data Handling" },
  { id: "usage-analytics", title: "4. Usage Analytics" },
  { id: "ai-processing", title: "5. AI Processing" },
  { id: "cookies-tracking", title: "6. Cookies & Tracking" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "data-sharing", title: "8. Data Sharing" },
  { id: "security-practices", title: "9. Security Practices" },
  { id: "user-rights", title: "10. User Rights" },
  { id: "contact-information", title: "11. Contact Information" },
  { id: "future-compliance", title: "12. Future Compliance Statement" },
]

export default function PrivacyPage() {

  const copyLink = (id: string) => {
    const url = \`\${window.location.origin}\${window.location.pathname}#\${id}\`
    navigator.clipboard.writeText(url)
  }

  const SectionHeader = ({ id, title }: { id: string, title: string }) => (
    <h2 id={id} className="text-2xl font-bold text-foreground mt-16 mb-6 group flex items-center gap-3 scroll-mt-24">
      {title}
      <button 
        onClick={() => copyLink(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
        title="Copy Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
    </h2>
  )

  return (
    <LegalLayout 
      title="Privacy Policy"
      lastUpdated="June 15, 2026"
      description="How we collect, use, and protect your data."
      sections={privacySections}
    >
      <SectionHeader id="overview" title="1. Overview" />
      <p>Welcome to BLACKOUT. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our infrastructure simulation platform, API, and associated services (collectively, the "Services").</p>
      <p>As a provider of enterprise developer tools, we prioritize data minimization and security. We only collect the data absolutely necessary to run our predictive simulations and improve our platform.</p>

      <SectionHeader id="information-we-collect" title="2. Information We Collect" />
      <p>We collect information that you provide directly to us, as well as data automatically generated through your use of the Services:</p>
      <ul>
        <li><strong>Account Data:</strong> Name, email address, company name, and authentication credentials (e.g., GitHub OAuth tokens).</li>
        <li><strong>Billing Data:</strong> Processed securely via our payment providers (e.g., Stripe). We do not store full credit card numbers on our servers.</li>
        <li><strong>Infrastructure Topology Data:</strong> JSON/YAML configurations, AWS IAM read-only outputs, or manual graph definitions uploaded for simulation.</li>
      </ul>

      <SectionHeader id="architecture-data-handling" title="3. Architecture Data Handling" />
      <p>Because BLACKOUT simulates failures on your infrastructure architecture, you must provide us with topological data (nodes, edges, dependencies). <strong>We treat your architecture data as highly confidential.</strong></p>
      <p>Topology graphs are stored encrypted at rest using AES-256 and are only loaded into memory during active cascade simulations. You may request the immediate deletion of an imported topology at any time via the dashboard or API.</p>

      <SectionHeader id="usage-analytics" title="4. Usage Analytics" />
      <p>To improve our Simulation Engine, we collect anonymized telemetry data, including:</p>
      <ul>
        <li>API request frequencies and latencies.</li>
        <li>Simulation execution times and generic success/failure rates.</li>
        <li>Browser type, IP address (anonymized), and access times.</li>
      </ul>

      <SectionHeader id="ai-processing" title="5. AI Processing" />
      <p>BLACKOUT uses Artificial Intelligence to predict root causes and blast radii. <strong>We do not use your proprietary infrastructure graphs to train public foundational AI models.</strong> Your simulation results and topologies are isolated to your workspace and are only processed for your direct benefit.</p>

      <SectionHeader id="cookies-tracking" title="6. Cookies & Tracking" />
      <p>We use essential cookies to maintain your authenticated session and secure the platform. We use minimal, privacy-respecting analytics cookies to understand how developers navigate our documentation and marketing pages. You can disable non-essential cookies via your browser settings.</p>

      <SectionHeader id="data-retention" title="7. Data Retention" />
      <p>We retain your personal information and architecture data only for as long as your account is active or as needed to provide you the Services. If you close your account, we will purge your infrastructure graphs and simulation history within 30 days.</p>

      <SectionHeader id="data-sharing" title="8. Data Sharing" />
      <p>We do not sell your personal data. We may share information with trusted third-party vendors who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to strict confidentiality and security obligations.</p>

      <SectionHeader id="security-practices" title="9. Security Practices" />
      <p>We implement robust, industry-standard security measures, including:</p>
      <ul>
        <li>End-to-end TLS 1.3 encryption for all data in transit.</li>
        <li>AES-256 encryption for data at rest.</li>
        <li>Strict Role-Based Access Control (RBAC) internally.</li>
        <li>Regular automated vulnerability scanning and third-party penetration testing.</li>
      </ul>

      <SectionHeader id="user-rights" title="10. User Rights" />
      <p>Depending on your location (e.g., GDPR in Europe, CCPA in California), you have the right to access, correct, delete, or restrict the processing of your personal data. You can exercise these rights directly within your account settings or by contacting us.</p>

      <SectionHeader id="contact-information" title="11. Contact Information" />
      <p>If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at:</p>
      <p><strong>Email:</strong> privacy@blackout.dev<br/>
          <strong>Address:</strong> BLACKOUT Inc., 100 System Failure Way, Suite 503, San Francisco, CA 94107</p>

      <SectionHeader id="future-compliance" title="12. Future Compliance Statement" />
      <p>As BLACKOUT evolves and expands globally, we continuously monitor and update our practices to comply with emerging international data protection regulations. We will notify you of any material changes to this policy via email and prominent notices within the platform.</p>
    </LegalLayout>
  )
}
