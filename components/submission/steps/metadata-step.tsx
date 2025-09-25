"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import {
  LICENSES,
  COMMON_TAGS,
  type StudySubmission,
} from "@/lib/types/database";

interface MetadataStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

export default function MetadataStep({ data, onUpdate }: MetadataStepProps) {
  const [newTag, setNewTag] = React.useState("");
  const [newContributor, setNewContributor] = React.useState({
    name: "",
    profile_url: "",
  });

  const tags = data.tags || [];
  const contributors = data.contributors || [];
  const links = data.links || {};

  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      handleChange("tags", [...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    handleChange(
      "tags",
      tags.filter((t) => t !== tag)
    );
  };

  const addCustomTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  const addContributor = () => {
    if (newContributor.name.trim()) {
      handleChange("contributors", [
        ...contributors,
        { ...newContributor, name: newContributor.name.trim() },
      ]);
      setNewContributor({ name: "", profile_url: "" });
    }
  };

  const removeContributor = (index: number) => {
    handleChange(
      "contributors",
      contributors.filter((_, i) => i !== index)
    );
  };

  const updateLinks = (field: keyof typeof links, value: string) => {
    handleChange("links", { ...links, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Contributors */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Contributors</Label>
          <p className="text-sm text-muted-foreground">
            Add yourself and other contributors to this research
          </p>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Contributor name"
              value={newContributor.name}
              onChange={(e) =>
                setNewContributor((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <Input
              placeholder="Profile URL (optional)"
              value={newContributor.profile_url}
              onChange={(e) =>
                setNewContributor((prev) => ({
                  ...prev,
                  profile_url: e.target.value,
                }))
              }
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addContributor}
            disabled={!newContributor.name.trim()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contributor
          </Button>
        </div>

        {contributors.length > 0 && (
          <div className="space-y-2">
            {contributors.map((contributor, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <div>
                  <span className="text-sm font-medium">
                    {contributor.name}
                  </span>
                  {contributor.profile_url && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({contributor.profile_url})
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeContributor(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Links */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Links</Label>
          <p className="text-sm text-muted-foreground">
            Add relevant links to your research
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="raw-data">Raw Data URL</Label>
            <Input
              id="raw-data"
              value={links.raw_data || ""}
              onChange={(e) => updateLinks("raw_data", e.target.value)}
              placeholder="https://drive.google.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="report">Report URL</Label>
            <Input
              id="report"
              value={links.report || ""}
              onChange={(e) => updateLinks("report", e.target.value)}
              placeholder="https://example.com/report.pdf"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="landing-page">Project Landing Page</Label>
            <Input
              id="landing-page"
              value={links.landing_page || ""}
              onChange={(e) => updateLinks("landing_page", e.target.value)}
              placeholder="https://yourproject.com"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Tags</Label>
          <p className="text-sm text-muted-foreground">
            Add tags to help others discover your research
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add custom tag"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTag();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCustomTag}
              disabled={!newTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Common tags:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TAGS.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(tag)}
                  disabled={tags.includes(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* License */}
      <div className="space-y-2">
        <Label htmlFor="license">License *</Label>
        <Select
          value={data.license || ""}
          onValueChange={(value) => handleChange("license", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a license" />
          </SelectTrigger>
          <SelectContent>
            {LICENSES.map((license) => (
              <SelectItem key={license} value={license}>
                {license}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          How others can use your research
        </p>
      </div>

      {/* Raw Data */}
      <div className="space-y-2">
        <Label htmlFor="raw-data-text">Raw Research Data *</Label>
        <Textarea
          id="raw-data-text"
          value={data.raw_data || ""}
          onChange={(e) => handleChange("raw_data", e.target.value)}
          placeholder="Paste your raw research notes, survey responses, interview transcripts, etc. This helps others understand the context and methodology of your research."
          rows={6}
          required
        />
        <p className="text-sm text-muted-foreground">
          Paste your original research data, notes, or transcripts here
        </p>
      </div>
    </div>
  );
}
