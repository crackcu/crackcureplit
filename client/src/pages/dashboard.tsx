import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, FileText, Play, Calendar, User, Award, Clock, Eye, Crown } from "lucide-react";
import { format } from "date-fns";
import type { MockSubmission, Course, Enrollment } from "@shared/schema";

type SubmissionWithTitle = MockSubmission & { mockTestTitle?: string };

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  const isPremium = user.isPremium;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="page-dashboard">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 ${isPremium ? "p-4 rounded-md border border-yellow-500/30 dark:border-yellow-600/40 bg-yellow-50/60 dark:bg-yellow-900/10 shadow-[0_0_20px_rgba(234,179,8,0.1)]" : ""}`}>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className={`h-14 w-14 border-2 ${isPremium ? "border-yellow-500 dark:border-yellow-400" : "border-border"}`} data-testid="avatar-profile">
                <AvatarFallback className={`text-lg font-bold ${isPremium ? "bg-yellow-500 dark:bg-yellow-600 text-white" : "bg-primary text-primary-foreground"}`}>
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              {isPremium && (
                <div className="absolute -top-2.5 -right-1 drop-shadow-[0_0_4px_rgba(234,179,8,0.6)]" data-testid="icon-premium-crown">
                  <Crown className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold" data-testid="text-welcome">Welcome, {user.fullName}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {isPremium ? (
              <Badge className="bg-yellow-500 dark:bg-yellow-600 text-white border-yellow-600 dark:border-yellow-500" data-testid="badge-premium">
                <Crown className="h-3 w-3 mr-1 fill-white" /> Premium
              </Badge>
            ) : (
              <Badge variant="outline">Free</Badge>
            )}
            <Badge variant="secondary">{user.role}</Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard user={user} />
          <RecentSubmissions userId={user.id} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <EnrolledCourses userId={user.id} />
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ user }: { user: any }) {
  return (
    <Card data-testid="card-profile">
      <CardHeader>
        <CardTitle className="text-base">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Full Name</p>
            <p className="font-medium">{user.fullName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">WhatsApp</p>
            <p className="font-medium">{user.whatsapp}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Username</p>
            <p className="font-medium font-mono">{user.username}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">HSC</p>
            <p className="font-medium">{user.hscGroup} | {user.hscYear} | {user.hscBoard}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">SSC</p>
            <p className="font-medium">{user.sscGroup} | {user.sscYear} | {user.sscBoard}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentSubmissions({ userId }: { userId: number }) {
  const { data: submissions, isLoading } = useQuery<SubmissionWithTitle[]>({
    queryKey: ["/api/my-submissions"],
  });

  return (
    <Card data-testid="card-submissions">
      <CardHeader>
        <CardTitle className="text-base">Recent Mock Tests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (<Skeleton key={i} className="h-12 w-full" />))}
          </div>
        ) : submissions && submissions.length > 0 ? (
          <div className="space-y-3">
            {submissions.slice(0, 10).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50" data-testid={`submission-${sub.id}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{sub.mockTestTitle || `Mock #${sub.mockTestId}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.submittedAt ? format(new Date(sub.submittedAt), "MMM dd, yyyy") : "In progress"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {sub.isSubmitted ? (
                    <>
                      <Badge variant={sub.passed ? "default" : "destructive"} className={sub.passed ? "bg-green-600" : ""}>
                        {sub.netMarks?.toFixed(1)}
                      </Badge>
                      <Link href={`/mock-review/${sub.id}`}>
                        <Button size="sm" variant="outline" data-testid={`button-review-${sub.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> Review
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Badge variant="outline">Ongoing</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No mock test submissions yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  return (
    <Card data-testid="card-quick-actions">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href="/mock-tests">
          <Button variant="outline" className="w-full justify-start" data-testid="action-mock-tests">
            <Play className="h-4 w-4 mr-2" />
            Take a Mock Test
          </Button>
        </Link>
        <Link href="/courses">
          <Button variant="outline" className="w-full justify-start" data-testid="action-courses">
            <BookOpen className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </Link>
        <Link href="/resources">
          <Button variant="outline" className="w-full justify-start" data-testid="action-resources">
            <FileText className="h-4 w-4 mr-2" />
            Study Resources
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function EnrolledCourses({ userId }: { userId: number }) {
  const { data: enrollments, isLoading } = useQuery<any[]>({
    queryKey: ["/api/my-enrollments"],
  });

  return (
    <Card data-testid="card-enrollments">
      <CardHeader>
        <CardTitle className="text-base">My Courses</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (<Skeleton key={i} className="h-10 w-full" />))}
          </div>
        ) : enrollments && enrollments.length > 0 ? (
          <div className="space-y-2">
            {enrollments.map((e: any) => (
              <div key={e.id} className="flex items-center gap-2 p-2 rounded-md bg-muted/50" data-testid={`enrollment-${e.id}`}>
                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm truncate">{e.courseTitle || `Course #${e.courseId}`}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not enrolled in any courses yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
