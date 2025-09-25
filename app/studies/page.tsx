"use client";

import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  ExternalLink,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { allRoutes } from "@/lib/auth/routes";

export default function StudiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const { data, isLoading } = db.useQuery({
    studies: {
      $: {
        order: {
          created_at: "desc",
        },
      },
    },
  });

  const studies = data?.studies || [];

  // Get unique industries and countries for filters
  const industries = [
    ...new Set(studies.map((s) => s.industry).filter(Boolean)),
  ];
  const countries = [
    ...new Set(studies.flatMap((s) => s.market?.countries || [])),
  ];

  // Filter studies
  const filteredStudies = studies.filter((study) => {
    const matchesSearch =
      !searchTerm ||
      study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      study.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesIndustry =
      !selectedIndustry || study.industry === selectedIndustry;
    const matchesCountry =
      !selectedCountry || study.market?.countries?.includes(selectedCountry);

    return matchesSearch && matchesIndustry && matchesCountry;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Studies Library
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover market research from the community
            </p>

            {/* Search and Filters */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search studies, tags, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredStudies.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {studies.length === 0
                    ? "No studies yet"
                    : "No matching studies"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {studies.length === 0
                    ? "Be the first to share your research with the community."
                    : "Try adjusting your search or filters."}
                </p>
                <Button asChild>
                  <Link href={allRoutes.SUBMIT}>Submit Research</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredStudies.length} of {studies.length} studies
                </p>
              </div>

              <div className="grid gap-6">
                {filteredStudies.map((study) => (
                  <Card
                    key={study.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            <Link
                              href={`${allRoutes.STUDIES}/${study.id}`}
                              className="hover:text-primary transition-colors"
                            >
                              {study.title}
                            </Link>
                          </CardTitle>
                          <p className="text-muted-foreground mb-4">
                            {study.summary}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(study.created_at).toLocaleDateString()}
                            </div>

                            {study.industry && (
                              <Badge variant="outline">{study.industry}</Badge>
                            )}

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

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`${allRoutes.STUDIES}/${study.id}`}>
                                View Details
                              </Link>
                            </Button>
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
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {study.top_findings &&
                          study.top_findings.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">
                                Key Findings:
                              </h4>
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
                                    +{study.top_findings.length - 3} more
                                    findings
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
