import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-background/50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <svg className="w-5.5 h-5.5 text-cyan-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L21 7.2v9.6L12 22L3 16.8V7.2L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="6" cy="15.5" r="1" fill="currentColor" />
                  <circle cx="18" cy="15.5" r="1" fill="currentColor" />
                  <path d="M12 5v5M12 14v6M6 15.5L10.5 13M18 15.5L13.5 13" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight">
                BLACK<span className="text-cyan-400">OUT</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Predict infrastructure failures before they impact your users.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "API Reference", href: "/docs/api" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {[
                { name: "Privacy", href: "/privacy" },
                { name: "Terms", href: "/terms" }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BLACKOUT. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
