export interface CvSectionData {
  title: string;
  items: string[];
}

export interface CvData {
  summary?: string;
  sections: CvSectionData[];
}

export interface FeaturedWorkRef {
  year: number;
  id: string;
}

export interface AboutData {
  intro: string;
  cvFile: string;
  profileImage?: string;
  cv?: CvData;
  featuredWorks?: FeaturedWorkRef[];
}
