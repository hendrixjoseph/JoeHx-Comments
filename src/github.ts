import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { TransformedData } from "./transform.js";
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = process.env.GITHUB_OWNER!;
const repo = process.env.GITHUB_REPO!;

export async function createPullRequest(data: TransformedData) {
  const { data: repoData } = await octokit.repos.get({ owner, repo });
  const baseBranch = repoData.default_branch;

  const { data: refData } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });
  const baseSha = refData.object.sha;

  await octokit.git.createRef({
    owner,
    repo,
    ref: `refs/heads/${data.pr.branch}`,
    sha: baseSha,
  });

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: data.pr.path,
    message: data.pr.title,
    content: Buffer.from(data.pr.body).toString("base64"),
    branch: data.pr.branch,
  });

  const { data: pr } = await octokit.pulls.create({
    owner: owner,
    repo: repo,
    title: data.pr.title,
    head: data.pr.branch,
    base: baseBranch,
    body: data.pr.body,
  });

  console.log(`✅ Created PR: ${pr.html_url}`);
  return pr.html_url;
}

