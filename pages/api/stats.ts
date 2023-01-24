import {
  findVideoIdByUser,
  updateStats,
  insertStats,
} from "../../lib/db/hasura";
import { verifyToken } from "../../lib/utils";

export default async function stats(req: any, res: any) {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(403);
    } else {
      const { videoId } = req.method === "POST" ? req.body : req.query;
      if (videoId) {
        const userId = await verifyToken(token);
        const foundVideos = await findVideoIdByUser(userId, videoId, token);
        const statsFound = foundVideos?.length > 0;
        if (req.method === "POST") {
          const { favourited, watched = true } = req.body;
          if (statsFound) {
            // update it
            const response = await updateStats(token, {
              favourited,
              userId,
              videoId,
              watched,
            });
            res.send({ data: response });
          } else {
            // add it
            const response = await insertStats(token, {
              favourited,
              userId,
              videoId,
              watched,
            });
            res.send({ data: response });
          }
        } else {
          if (statsFound) {
            res.send({ foundVideos });
          } else {
            // add it
            res.send({ user: null, message: "Video Not Found" });
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Error occurred /stats", error);
    res.status(500).send({ done: false, error: error?.message || error });
  }
}
