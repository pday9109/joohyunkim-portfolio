export interface Artwork {
  id: string;
  order: number;
  title: string;
  material: string;
  size: string;
  year: number;
  image: string;
  imageFull?: string;
}

export interface WorkYearData {
  year: number;
  artworks: Artwork[];
}
