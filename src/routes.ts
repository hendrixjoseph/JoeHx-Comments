import express, { Request, Response } from "express";
import multer from "multer";
import { BlogComment, transformData, TransformedData } from "./transform.js";
import { createPullRequest } from "./github.js";

const router = express.Router();
const upload = multer();

router.post("/comments", upload.none(), async (req: Request<{}, any, BlogComment>, res: Response) => {
  try {
    const formData = req.body;

    const transformed = transformData(formData);

    const prUrl = await createPullRequest(transformed);

    res.status(200).json({ message: "Pull Request created", prUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      details: (err as Error).message,
    });
  }
});

export const routes = router;
