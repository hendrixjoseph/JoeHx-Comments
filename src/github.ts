import axios from "axios";
import dotenv from "dotenv";
import { TransformedData } from "./transform.js";

dotenv.config();

const GITHUB_API = "https://api.github.com";

export async function createPullRequest(data: TransformedData): Promise<string> {
  const { branchName, commitMessage, filePath, content, title, body } = data;
  const token = process.env.GITHUB_TOKEN!;
  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;

  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
  };

  const repoData = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}`, {
    headers,
  });
  const baseBranch = repoData.data.default_branch;

  const baseRef = await axios.get(
    `${GITHUB_API}/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
    { headers }
  );
  const baseSha = baseRef.data.object.sha;

  await axios.post(
    `${GITHUB_API}/repos/${owner}/${repo}/git/refs`,
    { ref: `refs/heads/${branchName}`, sha: baseSha },
    { headers }
  );

  const encodedContent = Buffer.from(content).toString("base64");

  await axios.put(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`,
    {
      message: commitMessage,
      content: encodedContent,
      branch: branchName,
    },
    { headers }
  );

  const pr = await axios.post(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls`,
    {
      title,
      body,
      head: branchName,
      base: baseBranch,
    },
    { headers }
  );

  return pr.data.html_url;
}
