import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  ExternalLink,
  ArrowLeft,
  Clock,
  Building,
  Target,
  BarChart3,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { allRoutes } from "@/lib/auth/routes";

interface StudyPageProps {
  params: {
    id: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: StudyPageProps): Promise<Metadata> {
  try {
    const { studies } = await db.query({
      studies: {
        $: {
          where: {
            id: params.id,
          },
        },
      },
    });

    const study = studies[0];

    if (!study) {
      return {
        title: "Study Not Found | Open Market Research",
        description: "The requested study could not be found.",
      };
    }

    return {
      title: `${study.title} | Open Market Research`,
      description: study.summary,
      openGraph: {
        title: `${study.title} | Open Market Research`,
        description: study.summary,
        type: "article",
        publishedTime: study.created_at,
        authors:
          study.contributors
            ?.map((c: { name?: string }) => c.name)
            .filter(Boolean) || [],
        tags: study.tags || [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${study.title} | Open Market Research`,
        description: study.summary,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Study Details | Open Market Research",
      description:
        "View detailed market research study information and findings.",
    };
  }
}

export default async function StudyPage({ params }: StudyPageProps) {
  let study;

  try {
    const { studies } = await db.query({
      studies: {
        $: {
          where: {
            id: params.id,
          },
        },
      },
    });

    study = studies[0];
  } catch (error) {
    console.error("Error fetching study:", error);
    notFound();
  }

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link
                href={allRoutes.STUDIES}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Studies
              </Link>
            </Button>
          </div>

          {/* Study Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-4">{study.title}</CardTitle>
                  <p className="text-lg text-muted-foreground mb-6">
                    {study.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(study.created_at).toLocaleDateString()}
                    </div>

                    {study.industry && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Building className="h-3 w-3" />
                        {study.industry}
                      </Badge>
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

                  {study.links?.landing_page && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={study.links.landing_page}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Project
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Study Details */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Findings */}
              {study.top_findings && study.top_findings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Key Findings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {study.top_findings.map(
                        (finding: string, index: number) => (
                          <li key={index} className="flex items-start gap-3">
                            <span className="text-primary font-bold mt-1">
                              •
                            </span>
                            <span>{finding}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Insights */}
              {study.insights && study.insights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {study.insights.map((insight: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-primary font-bold mt-1">•</span>
                          <span>{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Tags */}
              {study.tags && study.tags.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {study.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Methodology */}
              {study.methodology && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Methodology</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {study.methodology.type && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Type
                        </p>
                        <p className="capitalize">{study.methodology.type}</p>
                      </div>
                    )}
                    {study.methodology.sample_size && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Sample Size
                        </p>
                        <p>{study.methodology.sample_size} participants</p>
                      </div>
                    )}
                    {study.methodology.collection_start && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Collection Period
                        </p>
                        <p className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(
                            study.methodology.collection_start
                          ).toLocaleDateString()}
                          {study.methodology.collection_end && (
                            <>
                              {" - "}
                              {new Date(
                                study.methodology.collection_end
                              ).toLocaleDateString()}
                            </>
                          )}
                        </p>
                      </div>
                    )}
                    {study.methodology.additional_notes && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Notes
                        </p>
                        <p className="text-sm">
                          {study.methodology.additional_notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Market Details */}
              {study.market && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Market</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {study.market.countries &&
                      study.market.countries.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Countries
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {study.market.countries.join(", ")}
                          </p>
                        </div>
                      )}
                    {study.market.cities && study.market.cities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Cities
                        </p>
                        <p>{study.market.cities.join(", ")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Target Audience */}
              {study.target_audience && study.target_audience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {study.target_audience.map((audience: string) => (
                        <Badge
                          key={audience}
                          variant="secondary"
                          className="mr-2 mb-2"
                        >
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Links */}
              {study.links && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <LinkIcon className="h-4 w-4" />
                      Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {study.links.landing_page && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <a
                          href={study.links.landing_page}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Project Landing Page
                        </a>
                      </Button>
                    )}
                    {study.links.research_paper && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <a
                          href={study.links.research_paper}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <FileText className="h-3 w-3" />
                          Research Paper
                        </a>
                      </Button>
                    )}
                    {study.links.data_source && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <a
                          href={study.links.data_source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="h-3 w-3" />
                          Data Source
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* License */}
              {study.license && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">License</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{study.license}</Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
