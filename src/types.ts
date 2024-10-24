export interface Download {
  day: string;
  downloads: number;
}

export interface PackageData {
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  downloads: Download[];
  github: string | null;
  homepage: string | null;
  maintainers: number;
  created: Date;
  modified: Date;
}

export interface ComparisonData {
  [key: string]: PackageData;
}