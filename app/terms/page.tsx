import { LegalLayout } from "@/components/legal/legal-layout"
import { Link as LinkIcon } from "lucide-react"

export const metadata = {
  title: "Terms of Service | BLACKOUT",
  description: "The rules and guidelines for using the BLACKOUT platform."
}

const termsSections = [
  { id: "acceptance-of-terms", title: "1. Acceptance of Terms" },
  { id: "service-description", title: "2. Service Description" },
  { id: "user-responsibilities", title: "3. User Responsibilities" },
  { id: "acceptable-use", title: "4. Acceptable Use Policy" },
  { id: "intellectual-property", title: "5. Intellectual Property" },
  { id: "ai-content-disclaimer", title: "6. AI-Generated Content" },
  { id: "service-availability", title: "7. Service Availability" },
  { id: "limitation-liability", title: "8. Limitation of Liability" },
  { id: "termination", title: "9. Termination" },
  { id: "changes-to-terms", title: "10. Changes to Terms" },
  { id: "governing-law", title: "11. Governing Law" },
  { id: "contact", title: "12. Contact Information" },
]

export default function TermsPage() {

  const copyLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
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
      title="Terms of Service"
      lastUpdated="June 15, 2026"
      description="The rules and guidelines for using the BLACKOUT platform."
      sections={termsSections}
    >
      <SectionHeader id="acceptance-of-terms" title="1. Acceptance of Terms" />
      <p>By registering for an account, accessing the BLACKOUT API, or utilizing our infrastructure simulation tools (the "Services"), you agree to be bound by these Terms of Service. If you are entering into these terms on behalf of an enterprise or organization, you represent that you have the authority to bind that entity.</p>

      <SectionHeader id="service-description" title="2. Service Description" />
      <p>BLACKOUT is a B2B SaaS platform that provides infrastructure topology mapping, synthetic chaos generation, and AI-driven cascading failure prediction. The Services are provided "as-is" and are intended for use in pre-production, staging, and controlled production environments. You understand that BLACKOUT simulates failure; you are solely responsible for ensuring these simulations do not breach your own SLAs.</p>

      <SectionHeader id="user-responsibilities" title="3. User Responsibilities" />
      <p>You are responsible for safeguarding your account credentials and API keys. You must ensure that any architecture data, JSON payloads, or integrations you connect to BLACKOUT do not contain unauthorized Personally Identifiable Information (PII) or breach your own internal compliance frameworks.</p>

      <SectionHeader id="acceptable-use" title="4. Acceptable Use Policy" />
      <p>You agree not to use BLACKOUT to:</p>
      <ul>
        <li>Simulate attacks against third-party infrastructure you do not own or have explicit authorization to test.</li>
        <li>Attempt to reverse engineer, decompile, or bypass the security mechanisms of the Simulation Engine.</li>
        <li>Use the platform to launch Distributed Denial of Service (DDoS) attacks against external targets.</li>
      </ul>

      <SectionHeader id="intellectual-property" title="5. Intellectual Property" />
      <p>All intellectual property rights in the Services, including the Simulation Engine, proprietary UI designs, and analysis algorithms, are owned by BLACKOUT Inc. You retain all rights to the infrastructure topology graphs and data you upload. By uploading data, you grant us a limited license to process it strictly to provide the Services to you.</p>

      <SectionHeader id="ai-content-disclaimer" title="6. AI-Generated Content Disclaimer" />
      <p>BLACKOUT utilizes Artificial Intelligence to predict failure propagation and suggest remediation strategies. <strong>AI-generated insights are predictive, not deterministic.</strong> You acknowledge that AI recommendations should be reviewed by human engineers before being applied to production environments. We do not guarantee the absolute accuracy of any AI-generated prediction.</p>

      <SectionHeader id="service-availability" title="7. Service Availability" />
      <p>We strive for 99.99% uptime for our Enterprise tier. However, we may experience hardware, software, or other problems requiring maintenance. We will notify users of scheduled downtime in advance via the Status Page. We are not liable for any losses incurred due to temporary unavailability of the dashboard or API.</p>

      <SectionHeader id="limitation-liability" title="8. Limitation of Liability" />
      <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL BLACKOUT INC. BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR REVENUE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICES—EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

      <SectionHeader id="termination" title="9. Termination" />
      <p>We may suspend or terminate your access to the Services immediately, without prior notice, if you breach the Acceptable Use Policy or fail to pay applicable subscription fees. Upon termination, your right to use the API and dashboard will cease immediately, and your topological data will be purged per our Privacy Policy.</p>

      <SectionHeader id="changes-to-terms" title="10. Changes to Terms" />
      <p>We reserve the right to modify these Terms at any time. Material changes will be communicated via email or an in-app notification at least 30 days before taking effect. Continued use of the Services after modifications constitutes acceptance of the updated Terms.</p>

      <SectionHeader id="governing-law" title="11. Governing Law" />
      <p>These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in San Francisco County, California.</p>

      <SectionHeader id="contact" title="12. Contact Information" />
      <p>If you have any questions about these Terms, please contact our legal team at:</p>
      <p><strong>Email:</strong> legal@blackout.dev<br/>
          <strong>Address:</strong> BLACKOUT Inc., 100 System Failure Way, Suite 503, San Francisco, CA 94107</p>
    </LegalLayout>
  )
}
