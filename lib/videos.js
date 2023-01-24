import videoTestData from "../data/youtubeResult.json";
import { getWatchedVideos, getMyListVideos } from "../lib/db/hasura";

export async function fetchVideos(url) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  const BASE_URL = "youtube.googleapis.com/youtube/v3";
  const respone = await fetch(
    `https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  return await respone.json();
}

export async function getCommonVideos(url) {
  try {
    const isDev = process.env.DEVELOPMENT;
    const data = isDev ? videoTestData : await fetchVideos(url);
    if (data?.error) {
      return [];
    }

    return data.items.map((video) => {
      const id = video?.id?.videoId || video?.id?.playlistId || video?.id;
      return {
        title: video?.snippet?.title,
        imgUrl: `http://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: video.snippet?.description,
        publishTime: video.snippet?.publishedAt,
        channelTitle: video.snippet?.channelTitle,
        statistics: video.statistics ? video.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("Something went wrong capturing video library", error);
    return [];
  }
}

export async function getVideos(searchQuery) {
  const URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(URL);
}

export async function getPopularVideos() {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US";

  return getCommonVideos(URL);
}

export async function getYoutubeVideoById(videoId) {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
}

export async function getPreviouslyWatchedVideos(token, userId) {
  const videos = await getWatchedVideos(token, userId);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `http://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
}

export async function getMyFavouriteVideos(token, userId) {
  const videos = await getMyListVideos(token, userId);
  return videos?.map((video) => {
    return {
      id: video.videoId,
      imgUrl: `http://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
    };
  });
}
