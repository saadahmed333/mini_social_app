export interface ReelItem {
  id: string;
  videoUrl: string;
  likes: number;
}

export const reelsData: ReelItem[] = [
  {
    id: '1',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    likes: 0,
  },
  {
    id: '2',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    likes: 0,
  },
  {
    id: '3',
    videoUrl:
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    likes: 0,
  },
];
