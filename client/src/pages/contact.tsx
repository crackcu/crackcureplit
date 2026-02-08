import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SiWhatsapp, SiFacebook, SiYoutube, SiTelegram } from "react-icons/si";
import type { TeamMember } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";

export default function ContactPage() {
  const { data: teamMembers, isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="page-contact">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch with the Crack-CU team</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ContactForm />
        <ContactInfo />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight mb-6">Our Team</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}><CardContent className="pt-6 text-center"><Skeleton className="h-16 w-16 rounded-full mx-auto mb-3" /><Skeleton className="h-5 w-32 mx-auto mb-2" /><Skeleton className="h-4 w-24 mx-auto" /></CardContent></Card>
            ))}
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, idx) => (
              <motion.div key={member.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
                <Card data-testid={`card-team-${member.id}`}>
                  <CardContent className="pt-6 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-border">
                      {member.photo && <AvatarImage src={member.photo} alt={member.name} />}
                      <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-sm" data-testid={`text-member-name-${member.id}`}>{member.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{member.post}</p>
                    {member.description && <p className="text-xs text-muted-foreground line-clamp-2">{member.description}</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Team profiles coming soon.</p>
        )}
      </div>
    </div>
  );
}

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await apiRequest("POST", "/api/contact", formData);
      toast({ title: "Message sent successfully!" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      toast({ title: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" data-testid="input-name" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" data-testid="input-email" />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="Message subject" data-testid="input-subject" />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea id="message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Your message..." rows={4} data-testid="input-message" />
          </div>
          <Button type="submit" disabled={loading} data-testid="button-send">
            <Send className="h-3.5 w-3.5 mr-1" />
            {loading ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ContactInfo() {
  const SOCIALS = [
    { icon: SiWhatsapp, href: "https://wa.me/8801522132809", label: "WhatsApp" },
    { icon: SiFacebook, href: "#", label: "Facebook" },
    { icon: SiYoutube, href: "#", label: "YouTube" },
    { icon: SiTelegram, href: "#", label: "Telegram" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">+880 1522-132809</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">crack.info@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Location</p>
              <p className="text-sm text-muted-foreground">Chittagong, Bangladesh</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm font-medium mb-3">Follow Us</p>
          <div className="flex gap-3">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" data-testid={`social-${s.label.toLowerCase()}`}>
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
