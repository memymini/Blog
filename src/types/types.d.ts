export interface Content {
  id: string;
  createdAt: string;
  modifiedAt?: string;
  title: string;
  summary: string;
  category?: string;
  imageUrl?: string;
}

export interface User {
  name: string;
  profile: string;
}
