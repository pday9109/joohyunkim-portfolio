export type ExhibitionTab = "solo" | "group";

export interface SiteConfig {
  artistName: string;
  artistNameEn: string;
  mainBackgroundImage: string;
  defaultWorkYear: number;
  defaultExhibitionTab: ExhibitionTab;
  workYears: number[];
}
