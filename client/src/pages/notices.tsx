import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Bell } from "lucide-react";
import type { Notice } from "@shared/schema";

const FILTER_TAGS = ["All", "Admission", "CU Notice", "Crack-CU Notice"];

export default function NoticesPage() {
  const { data: noticeItems, isLoading } = useQuery<Notice[]>({
    queryKey: ["/api/notices"],
  });
  const [filter, setFilter] = useState("All");

  const filtered = noticeItems?.filter((n) => filter === "All" || n.tag === filter) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="page-notices">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Notices</h1>
        <p className="text-muted-foreground mb-6">Stay updated with the latest notices</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TAGS.map((tag) => (
          <Button
            key={tag}
            variant={filter === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(tag)}
            data-testid={`filter-${tag.toLowerCase().replace(/\s/g, "-")}`}
          >
            {tag}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-5 w-3/4 mb-3" /><Skeleton className="h-4 w-full mb-2" /><Skeleton className="h-4 w-2/3" /></CardContent></Card>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((notice, idx) => (
            <motion.div key={notice.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
              <Card data-testid={`card-notice-${notice.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base">
                      <Bell className="h-4 w-4 inline mr-1.5 -mt-0.5" />
                      {notice.title}
                    </CardTitle>
                    <Badge variant="secondary">{notice.tag}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(notice.createdAt), "MMM dd, yyyy")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{notice.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No notices available for this filter.</p>
        </div>
      )}
    </div>
  );
}
