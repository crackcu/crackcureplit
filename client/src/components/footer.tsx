import { Link } from "wouter";
import { Logo } from "@/components/logo";
import { SiWhatsapp, SiFacebook, SiYoutube, SiTelegram } from "react-icons/si";
import { Mail, Phone, MapPin } from "lucide-react";

const QUICK_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Video Classes", href: "/classes" },
  { label: "Study Materials", href: "/resources" },
  { label: "Notices", href: "/notices" },
  { label: "Profile", href: "/dashboard" },
];

const SOCIAL_LINKS = [
  { icon: SiWhatsapp, href: "https://wa.me/8801522132809", label: "WhatsApp" },
  { icon: SiFacebook, href: "#", label: "Facebook" },
  { icon: SiYoutube, href: "#", label: "YouTube" },
  { icon: SiTelegram, href: "#", label: "Telegram" },
];

export function Footer() {
  return (
    <footer className="border-t bg-card" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-xs">
              Don't Just Study, Crack It! Your ultimate platform for Chittagong University admission preparation.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Contact Us</h4>
            <div className="flex items-center gap-2 mb-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  data-testid={`social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <span>+880 1522-132809</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span>crack.info@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>Chittagong, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Crack-CU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
