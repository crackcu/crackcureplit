import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import {
  Users,
  BookOpen,
  FileText,
  Video,
  Bell,
  Plus,
  Image as ImageIcon,
  Settings,
  Shield,
  Loader2,
  UserPlus,
} from "lucide-react";
import type { User, Course, MockTest, Class, Resource, Notice, TeamMember, HeroBanner } from "@shared/schema";
import { MOCK_TAGS, CLASS_TAGS, RESOURCE_TAGS, ACCESS_LEVELS, USER_ROLES } from "@shared/schema";
import { Redirect } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="page-admin">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <Badge variant="secondary">{user.role}</Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="users" data-testid="tab-users">Users</TabsTrigger>
          <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
          <TabsTrigger value="mock-tests" data-testid="tab-mock-tests">Mock Tests</TabsTrigger>
          <TabsTrigger value="classes" data-testid="tab-classes">Classes</TabsTrigger>
          <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
          <TabsTrigger value="notices" data-testid="tab-notices">Notices</TabsTrigger>
          <TabsTrigger value="banners" data-testid="tab-banners">Banners</TabsTrigger>
          <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
        <TabsContent value="courses"><CoursesTab /></TabsContent>
        <TabsContent value="mock-tests"><MockTestsTab /></TabsContent>
        <TabsContent value="classes"><ClassesTab /></TabsContent>
        <TabsContent value="resources"><ResourcesTab /></TabsContent>
        <TabsContent value="notices"><NoticesTab /></TabsContent>
        <TabsContent value="banners"><BannersTab /></TabsContent>
        <TabsContent value="team"><TeamTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  const { data: stats, isLoading } = useQuery<any>({ queryKey: ["/api/admin/stats"] });

  const cards = [
    { label: "Users", value: stats?.users ?? 0, icon: Users },
    { label: "Courses", value: stats?.courses ?? 0, icon: BookOpen },
    { label: "Mock Tests", value: stats?.mockTests ?? 0, icon: FileText },
    { label: "Classes", value: stats?.classes ?? 0, icon: Video },
    { label: "Resources", value: stats?.resources ?? 0, icon: FileText },
    { label: "Notices", value: stats?.notices ?? 0, icon: Bell },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="pt-6 text-center">
            <card.icon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-2xl font-bold" data-testid={`stat-${card.label.toLowerCase()}`}>
              {isLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : card.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UsersTab() {
  const { data: allUsers, isLoading } = useQuery<User[]>({ queryKey: ["/api/admin/users"] });
  const { toast } = useToast();

  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User role updated" });
    },
  });

  const toggleRestriction = useMutation({
    mutationFn: async ({ userId, isRestricted }: { userId: number; isRestricted: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}`, { isRestricted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User restriction updated" });
    },
  });

  const togglePremium = useMutation({
    mutationFn: async ({ userId, isPremium }: { userId: number; isPremium: boolean }) => {
      await apiRequest("PATCH", `/api/admin/users/${userId}`, { isPremium });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Premium status updated" });
    },
  });

  if (isLoading) return <Skeleton className="h-48 w-full" />;

  return (
    <div className="space-y-3">
      {allUsers?.map((u) => (
        <Card key={u.id} data-testid={`card-user-${u.id}`}>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm">{u.fullName}</p>
                  <Badge variant="secondary" className="text-xs">{u.role}</Badge>
                  {u.isPremium && <Badge className="bg-green-600 text-xs">Premium</Badge>}
                  {u.isRestricted && <Badge variant="destructive" className="text-xs">Restricted</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">@{u.username} | {u.whatsapp}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  value={u.role}
                  onValueChange={(role) => updateRole.mutate({ userId: u.id, role })}
                >
                  <SelectTrigger className="w-32" data-testid={`select-role-${u.id}`}><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Premium</Label>
                  <Switch checked={u.isPremium} onCheckedChange={(v) => togglePremium.mutate({ userId: u.id, isPremium: v })} data-testid={`switch-premium-${u.id}`} />
                </div>
                <div className="flex items-center gap-1">
                  <Label className="text-xs">Restricted</Label>
                  <Switch checked={u.isRestricted} onCheckedChange={(v) => toggleRestriction.mutate({ userId: u.id, isRestricted: v })} data-testid={`switch-restrict-${u.id}`} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {(!allUsers || allUsers.length === 0) && <p className="text-sm text-muted-foreground">No users found.</p>}
    </div>
  );
}

function CreateItemForm({ endpoint, fields, queryKey, onCreated }: {
  endpoint: string;
  fields: { name: string; label: string; type?: string; options?: readonly string[]; required?: boolean }[];
  queryKey: string;
  onCreated?: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast({ title: "Created successfully" });
      setFormData({});
      setIsOpen(false);
      onCreated?.();
    },
    onError: (error: Error) => {
      toast({ title: error.message, variant: "destructive" });
    },
  });

  if (!isOpen) {
    return (
      <Button size="sm" onClick={() => setIsOpen(true)} data-testid="button-create-new">
        <Plus className="h-3.5 w-3.5 mr-1" />
        Create New
      </Button>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="space-y-3"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <Label className="text-xs">{field.label}</Label>
              {field.options ? (
                <Select value={formData[field.name] || ""} onValueChange={(v) => setFormData({ ...formData, [field.name]: v })}>
                  <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
                  <SelectContent>
                    {field.options.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="text-sm"
                />
              ) : field.type === "switch" ? (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData[field.name] ?? true}
                    onCheckedChange={(v) => setFormData({ ...formData, [field.name]: v })}
                  />
                </div>
              ) : (
                <Input
                  type={field.type || "text"}
                  value={formData[field.name] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value })}
                  required={field.required}
                  className="text-sm"
                />
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
              Create
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function CoursesTab() {
  const { data: courseList, isLoading } = useQuery<Course[]>({ queryKey: ["/api/admin/courses"] });

  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/courses"
        queryKey="/api/admin/courses"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "price", label: "Price (BDT)", type: "number" },
          { name: "offerPrice", label: "Offer Price", type: "number" },
          { name: "access", label: "Access", options: ACCESS_LEVELS },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      {isLoading ? <Skeleton className="h-48 w-full" /> : (
        <div className="space-y-2 mt-4">
          {courseList?.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4 flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">BDT {c.price} | {c.access}</p>
                </div>
                <Badge variant={c.isVisible ? "default" : "outline"}>{c.isVisible ? "Visible" : "Hidden"}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MockTestsTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/mock-tests"
        queryKey="/api/admin/mock-tests"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "tag", label: "Tag", options: MOCK_TAGS },
          { name: "publishTime", label: "Publish Time (ISO)", required: true },
          { name: "duration", label: "Duration (min)", type: "number" },
          { name: "access", label: "Access", options: ACCESS_LEVELS },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/mock-tests" />
    </div>
  );
}

function ClassesTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/classes"
        queryKey="/api/admin/classes"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "videoUrl", label: "Video URL", required: true },
          { name: "tag", label: "Tag", options: CLASS_TAGS },
          { name: "description", label: "Description", type: "textarea" },
          { name: "access", label: "Access", options: ACCESS_LEVELS },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/classes" />
    </div>
  );
}

function ResourcesTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/resources"
        queryKey="/api/admin/resources"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "fileUrl", label: "File URL", required: true },
          { name: "tag", label: "Tag", options: RESOURCE_TAGS },
          { name: "description", label: "Description", type: "textarea" },
          { name: "access", label: "Access", options: ACCESS_LEVELS },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/resources" />
    </div>
  );
}

function NoticesTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/notices"
        queryKey="/api/admin/notices"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "tag", label: "Tag", options: ["Admission", "CU Notice", "Crack-CU Notice"] },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/notices" />
    </div>
  );
}

function BannersTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/banners"
        queryKey="/api/admin/banners"
        fields={[
          { name: "title", label: "Title", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "imageUrl", label: "Image URL" },
          { name: "linkUrl", label: "Link URL" },
          { name: "sortOrder", label: "Sort Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/banners" />
    </div>
  );
}

function TeamTab() {
  return (
    <div>
      <CreateItemForm
        endpoint="/api/admin/team"
        queryKey="/api/admin/team"
        fields={[
          { name: "name", label: "Name", required: true },
          { name: "post", label: "Post/Title", required: true },
          { name: "photo", label: "Photo URL" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "sortOrder", label: "Sort Order", type: "number" },
          { name: "isVisible", label: "Visible", type: "switch" },
        ]}
      />
      <AdminListView queryKey="/api/admin/team" />
    </div>
  );
}

function AdminListView({ queryKey }: { queryKey: string }) {
  const { data: items, isLoading } = useQuery<any[]>({ queryKey: [queryKey] });

  if (isLoading) return <Skeleton className="h-32 w-full mt-4" />;

  return (
    <div className="space-y-2 mt-4">
      {items?.map((item: any) => (
        <Card key={item.id}>
          <CardContent className="pt-4 flex items-center justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{item.title || item.name}</p>
              <p className="text-xs text-muted-foreground">{item.tag || item.post || ""}</p>
            </div>
            <Badge variant={item.isVisible !== false ? "default" : "outline"}>
              {item.isVisible !== false ? "Visible" : "Hidden"}
            </Badge>
          </CardContent>
        </Card>
      ))}
      {(!items || items.length === 0) && <p className="text-sm text-muted-foreground mt-4">No items yet.</p>}
    </div>
  );
}
