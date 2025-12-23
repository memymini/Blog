export interface PostItemData {
  id: number;
  title: string;
  subTitle:string;
  date: string;
  category: string;
  image: string;
}

export interface PostListData {
  posts: PostItemData[];
}


export interface StoryItemData {
  title: string;
  content: string;
  imageUrl: string;
}