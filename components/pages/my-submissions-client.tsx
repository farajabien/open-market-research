"use client";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { allRoutes } from "@/lib/auth/routes";

export default function MySubmissionsClient() {
  const user = db.useUser();
  const { data, isLoading } = db.useQuery({
    studies: {
      $: {
        where: {
          created_by: user?.id,
        },
        order: {
          created_at: "desc",
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
          <p className="text-muted-foreground mb-4">
            Please sign in to view your submissions.
          </p>
          <Button asChild>
            <Link href={allRoutes.SUBMIT}>Get Started</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            Loading your submissions...
          </p>
        </div>
      </div>
    );
  }

  const studies = data?.studies || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">
            View and manage your research submissions
          </p>
        </div>

        {studies.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-4">
                Start contributing to the community by sharing your research.
              </p>
              <Button asChild>
                <Link href={allRoutes.SUBMIT}>Submit Your First Study</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {studies.map((study) => (
              <Card
                key={study.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {study.title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-4">
                        {study.summary}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(study.created_at).toLocaleDateString()}
                        </div>

                        {study.market?.countries &&
                          study.market.countries.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {study.market.countries.join(", ")}
                            </div>
                          )}

                        {study.methodology?.sample_size && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {study.methodology.sample_size} participants
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          study.verification_status === "verified"
                            ? "default"
                            : study.verification_status === "rejected"
                            ? "destructive"
                            : study.verification_status === "needs_revision"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {study.verification_status.replace("_", " ")}
                      </Badge>

                      {study.links?.landing_page && (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={study.links.landing_page}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Project
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {study.top_findings && study.top_findings.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Findings:</h4>
                        <ul className="space-y-1">
                          {study.top_findings
                            .slice(0, 3)
                            .map((finding: string, index: number) => (
                              <li
                                key={index}
                                className="text-sm text-muted-foreground flex items-start gap-2"
                              >
                                <span className="text-primary">•</span>
                                {finding}
                              </li>
                            ))}
                          {study.top_findings.length > 3 && (
                            <li className="text-sm text-muted-foreground">
                              +{study.top_findings.length - 3} more findings
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {study.tags && study.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {study.tags.slice(0, 5).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {study.tags.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{study.tags.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
