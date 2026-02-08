import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { BookOpen, Calendar, Image as ImageIcon } from "lucide-react";
import type { Course } from "@shared/schema";

export default function CoursesPage() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" data-testid="page-courses">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold tracking-tight mb-2" data-testid="heading-courses">Courses</h1>
        <p className="text-muted-foreground mb-6" data-testid="text-courses-subtitle">
          Explore our courses for CU admission preparation
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-44 w-full rounded-t-xl rounded-b-none" />
              <CardContent className="pt-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card className="overflow-visible flex flex-col h-full" data-testid={`card-course-${course.id}`}>
                <div className="relative h-44 bg-muted rounded-t-xl flex items-center justify-center">
                  {course.bannerImage ? (
                    <img
                      src={course.bannerImage}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-xl"
                      loading="lazy"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <CardTitle className="text-base line-clamp-1" data-testid={`text-course-title-${course.id}`}>
                      {course.title}
                    </CardTitle>
                    {course.price === 0 ? (
                      <Badge variant="outline">Free</Badge>
                    ) : (
                      <div className="flex items-center gap-1">
                        {course.offerPrice != null && course.offerPrice < course.price && (
                          <span className="text-xs text-muted-foreground line-through">BDT {course.price}</span>
                        )}
                        <Badge>
                          BDT {course.offerPrice != null && course.offerPrice < course.price ? course.offerPrice : course.price}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2" data-testid={`text-course-desc-${course.id}`}>
                    {course.description}
                  </p>
                  {course.lastDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Last Date: {format(new Date(course.lastDate), "MMM dd, yyyy")}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="gap-2 flex-wrap">
                  <Button variant="outline" size="sm" data-testid={`button-course-more-${course.id}`}>
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    More
                  </Button>
                  <Button size="sm" data-testid={`button-course-enroll-${course.id}`}>
                    Enroll
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-muted-foreground">No courses available yet.</p>
        </div>
      )}
    </div>
  );
}
