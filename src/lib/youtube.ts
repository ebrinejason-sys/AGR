import { getServerEnv } from './env';

export const YOUTUBE_API_KEY = getServerEnv('YOUTUBE_API_KEY');
export const YOUTUBE_CHANNEL_ID = getServerEnv('YOUTUBE_CHANNEL_ID', 'UC_your_channel_id_here');

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  viewCount?: string;
  likeCount?: string;
};

export type YouTubeChannelStats = {
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
  title: string;
  customUrl: string;
  thumbnail: string;
};

const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function getChannelData() {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API Key is not configured.');
  }

  const response = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Failed to fetch YouTube channel data');
  }

  const item = data.items?.[0];
  if (!item) throw new Error('Channel not found');

  return {
    title: item.snippet.title,
    customUrl: item.snippet.customUrl,
    thumbnail: item.snippet.thumbnails.medium.url,
    subscriberCount: item.statistics.subscriberCount,
    viewCount: item.statistics.viewCount,
    videoCount: item.statistics.videoCount,
  } as YouTubeChannelStats;
}

export async function getRecentVideos(maxResults = 12) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API Key is not configured.');
  }

  // 1. Get recent video IDs via search
  const searchResponse = await fetch(`${BASE_URL}/search?part=snippet&channelId=${YOUTUBE_CHANNEL_ID}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`);
  const searchData = await searchResponse.json();

  if (!searchResponse.ok) {
    throw new Error(searchData.error?.message || 'Failed to fetch YouTube videos');
  }

  const videoIds = searchData.items?.map((item: any) => item.id.videoId).join(',') || '';
  if (!videoIds) return [];

  // 2. Get detailed video stats
  const videoResponse = await fetch(`${BASE_URL}/videos?part=snippet,statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
  const videoData = await videoResponse.json();

  if (!videoResponse.ok) {
    throw new Error(videoData.error?.message || 'Failed to fetch YouTube video details');
  }

  return videoData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
    viewCount: item.statistics.viewCount,
    likeCount: item.statistics.likeCount,
  })) as YouTubeVideo[];
}
