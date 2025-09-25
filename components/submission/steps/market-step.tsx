"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { COUNTRIES, type StudySubmission } from "@/lib/types/database";

interface MarketStepProps {
  data: Partial<StudySubmission>;
  onUpdate: (data: Partial<StudySubmission>) => void;
}

export default function MarketStep({ data, onUpdate }: MarketStepProps) {
  const [newCity, setNewCity] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState("");

  const countries = data.countries || [];
  const cities = data.cities || [];

  const handleChange = (field: keyof StudySubmission, value: unknown) => {
    onUpdate({ [field]: value });
  };

  const addCountry = (country: string) => {
    if (country && !countries.includes(country)) {
      handleChange("countries", [...countries, country]);
    }
    setSelectedCountry("");
  };

  const removeCountry = (country: string) => {
    handleChange(
      "countries",
      countries.filter((c) => c !== country)
    );
  };

  const addCity = () => {
    if (newCity.trim() && !cities.includes(newCity.trim())) {
      handleChange("cities", [...cities, newCity.trim()]);
      setNewCity("");
    }
  };

  const removeCity = (city: string) => {
    handleChange(
      "cities",
      cities.filter((c) => c !== city)
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Countries *</Label>
          <div className="flex gap-2">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select countries" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addCountry(selectedCountry)}
              disabled={!selectedCountry}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Select all countries where this research was conducted
          </p>
        </div>

        {countries.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {countries.map((country) => (
              <Badge key={country} variant="secondary" className="gap-1">
                {country}
                <button
                  type="button"
                  onClick={() => removeCountry(country)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Cities</Label>
          <div className="flex gap-2">
            <Input
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Enter city name"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCity();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCity}
              disabled={!newCity.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Add specific cities where research was conducted (optional)
          </p>
        </div>

        {cities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <Badge key={city} variant="secondary" className="gap-1">
                {city}
                <button
                  type="button"
                  onClick={() => removeCity(city)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
