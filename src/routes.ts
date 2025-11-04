import express, { Request, Response } from "express";
import multer from "multer";
import { createPullRequest } from "./github.js";
import { BlogComment, transformData } from "./transform.js";
import { validateComment } from "./validation.js";

const router = express.Router();
const upload = multer();

router.post("/comments", upload.none(), async (req: Request<{}, any, BlogComment>, res: Response) => {
  try {
    const comment = req.body;

    await validateComment(comment);

    const transformed = transformData(comment);

    const prUrl = await createPullRequest(transformed);

    res.status(201).json({ message: "Pull Request created", prUrl });
  } catch (err) {
    if (typeof err === "string") {
      res.status(400).json({
        error: "Validation Error",
        details: err
      });
    } else {
      res.status(500).json({
        error: "Internal Server Error",
        details: JSON.stringify(err),
      });
    }
  }
});

router.get('/health', async (req: Request, res: Response) => {
  res.status(200).json({health: 'healthy'});
});

export const routes = router;
