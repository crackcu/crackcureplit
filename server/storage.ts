import {
  type User, type InsertUser,
  type HeroBanner, type InsertHeroBanner,
  type Course, type InsertCourse,
  type MockTest, type InsertMockTest,
  type MockSubmission, type InsertMockSubmission,
  type Class, type InsertClass,
  type Resource, type InsertResource,
  type Notice, type InsertNotice,
  type TeamMember, type InsertTeamMember,
  type Enrollment, type InsertEnrollment,
  type SiteSetting,
  users, heroBanners, courses, mockTests, mockSubmissions, classes, resources, notices, teamMembers, enrollments, siteSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByWhatsapp(whatsapp: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<User>): Promise<User | undefined>;

  getHeroBanners(): Promise<HeroBanner[]>;
  getAllHeroBanners(): Promise<HeroBanner[]>;
  createHeroBanner(data: InsertHeroBanner): Promise<HeroBanner>;

  getLatestCourses(limit: number): Promise<Course[]>;
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(data: InsertCourse): Promise<Course>;

  getLatestMockTests(limit: number): Promise<MockTest[]>;
  getAllMockTests(): Promise<MockTest[]>;
  getMockTest(id: number): Promise<MockTest | undefined>;
  createMockTest(data: InsertMockTest): Promise<MockTest>;

  getLatestClasses(limit: number): Promise<Class[]>;
  getAllClasses(): Promise<Class[]>;
  createClass(data: InsertClass): Promise<Class>;

  getLatestResources(limit: number): Promise<Resource[]>;
  getAllResources(): Promise<Resource[]>;
  createResource(data: InsertResource): Promise<Resource>;

  getLatestNotices(limit: number): Promise<Notice[]>;
  getAllNotices(): Promise<Notice[]>;
  createNotice(data: InsertNotice): Promise<Notice>;

  getTeamMembers(): Promise<TeamMember[]>;
  getAllTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(data: InsertTeamMember): Promise<TeamMember>;

  createSubmission(data: InsertMockSubmission): Promise<MockSubmission>;
  getSubmission(id: number): Promise<MockSubmission | undefined>;
  getUserSubmissions(userId: number): Promise<MockSubmission[]>;
  updateSubmission(id: number, data: Partial<MockSubmission>): Promise<MockSubmission | undefined>;

  createEnrollment(data: InsertEnrollment): Promise<Enrollment>;
  getUserEnrollments(userId: number): Promise<Enrollment[]>;
  getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined>;

  getSetting(key: string): Promise<SiteSetting | undefined>;
  setSetting(key: string, value: any): Promise<SiteSetting>;

  getStats(): Promise<Record<string, number>>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByWhatsapp(whatsapp: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.whatsapp, whatsapp));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async getHeroBanners(): Promise<HeroBanner[]> {
    return db.select().from(heroBanners).where(eq(heroBanners.isVisible, true)).orderBy(heroBanners.sortOrder);
  }

  async getAllHeroBanners(): Promise<HeroBanner[]> {
    return db.select().from(heroBanners).orderBy(heroBanners.sortOrder);
  }

  async createHeroBanner(data: InsertHeroBanner): Promise<HeroBanner> {
    const [banner] = await db.insert(heroBanners).values(data).returning();
    return banner;
  }

  async getLatestCourses(limit: number): Promise<Course[]> {
    return db.select().from(courses).where(eq(courses.isVisible, true)).orderBy(desc(courses.createdAt)).limit(limit);
  }

  async getAllCourses(): Promise<Course[]> {
    return db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(data: InsertCourse): Promise<Course> {
    const [course] = await db.insert(courses).values(data).returning();
    return course;
  }

  async getLatestMockTests(limit: number): Promise<MockTest[]> {
    return db.select().from(mockTests).where(eq(mockTests.isVisible, true)).orderBy(desc(mockTests.createdAt)).limit(limit);
  }

  async getAllMockTests(): Promise<MockTest[]> {
    return db.select().from(mockTests).orderBy(desc(mockTests.createdAt));
  }

  async getMockTest(id: number): Promise<MockTest | undefined> {
    const [test] = await db.select().from(mockTests).where(eq(mockTests.id, id));
    return test;
  }

  async createMockTest(data: InsertMockTest): Promise<MockTest> {
    const [test] = await db.insert(mockTests).values(data).returning();
    return test;
  }

  async getLatestClasses(limit: number): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.isVisible, true)).orderBy(desc(classes.createdAt)).limit(limit);
  }

  async getAllClasses(): Promise<Class[]> {
    return db.select().from(classes).orderBy(desc(classes.createdAt));
  }

  async createClass(data: InsertClass): Promise<Class> {
    const [cls] = await db.insert(classes).values(data).returning();
    return cls;
  }

  async getLatestResources(limit: number): Promise<Resource[]> {
    return db.select().from(resources).where(eq(resources.isVisible, true)).orderBy(desc(resources.createdAt)).limit(limit);
  }

  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources).orderBy(desc(resources.createdAt));
  }

  async createResource(data: InsertResource): Promise<Resource> {
    const [resource] = await db.insert(resources).values(data).returning();
    return resource;
  }

  async getLatestNotices(limit: number): Promise<Notice[]> {
    return db.select().from(notices).where(eq(notices.isVisible, true)).orderBy(desc(notices.createdAt)).limit(limit);
  }

  async getAllNotices(): Promise<Notice[]> {
    return db.select().from(notices).orderBy(desc(notices.createdAt));
  }

  async createNotice(data: InsertNotice): Promise<Notice> {
    const [notice] = await db.insert(notices).values(data).returning();
    return notice;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers).where(eq(teamMembers.isVisible, true)).orderBy(teamMembers.sortOrder);
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  }

  async createSubmission(data: InsertMockSubmission): Promise<MockSubmission> {
    const [sub] = await db.insert(mockSubmissions).values(data).returning();
    return sub;
  }

  async getSubmission(id: number): Promise<MockSubmission | undefined> {
    const [sub] = await db.select().from(mockSubmissions).where(eq(mockSubmissions.id, id));
    return sub;
  }

  async getUserSubmissions(userId: number): Promise<MockSubmission[]> {
    return db.select().from(mockSubmissions).where(eq(mockSubmissions.userId, userId)).orderBy(desc(mockSubmissions.startedAt));
  }

  async updateSubmission(id: number, data: Partial<MockSubmission>): Promise<MockSubmission | undefined> {
    const [sub] = await db.update(mockSubmissions).set(data).where(eq(mockSubmissions.id, id)).returning();
    return sub;
  }

  async createEnrollment(data: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(data).returning();
    return enrollment;
  }

  async getUserEnrollments(userId: number): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.createdAt));
  }

  async getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments).where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment;
  }

  async getSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async setSetting(key: string, value: any): Promise<SiteSetting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [updated] = await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key)).returning();
      return updated;
    }
    const [setting] = await db.insert(siteSettings).values({ key, value }).returning();
    return setting;
  }

  async getStats(): Promise<Record<string, number>> {
    const [[userCount], [courseCount], [testCount], [classCount], [resourceCount], [noticeCount]] = await Promise.all([
      db.select({ count: count() }).from(users),
      db.select({ count: count() }).from(courses),
      db.select({ count: count() }).from(mockTests),
      db.select({ count: count() }).from(classes),
      db.select({ count: count() }).from(resources),
      db.select({ count: count() }).from(notices),
    ]);
    return {
      users: userCount.count,
      courses: courseCount.count,
      mockTests: testCount.count,
      classes: classCount.count,
      resources: resourceCount.count,
      notices: noticeCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
