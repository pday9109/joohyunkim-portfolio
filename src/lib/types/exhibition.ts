export type ExhibitionType = "solo" | "group";

export interface Exhibition {
  id: string;
  title: string;
  text: string;
  images: string[];
  year?: number;
}

export interface ExhibitionData {
  type: ExhibitionType;
  exhibitions: Exhibition[];
}
