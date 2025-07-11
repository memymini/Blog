export interface Content {
  id: string;
  createdAt: string;
  modifiedAt?: string;
  title: string;
  summary: string;
  category?: string;
  imageUrl?: string;
}
