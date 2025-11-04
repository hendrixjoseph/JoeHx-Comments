import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { TransformedData } from "./transform.js";
import { stringify } from 'yaml'

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
    owner: owner,
    repo: repo,
    ref: `heads/${baseBranch}`,
  });

  const baseSha = refData.object.sha;

  await octokit.git.createRef({
    owner: owner,
    repo: repo,
    ref: `refs/heads/${data.pr.branch}`,
    sha: baseSha,
  });

  const yaml = stringify(data.comment);

  await octokit.repos.createOrUpdateFileContents({
    owner: owner,
    repo: repo,
    path: data.pr.path,
    message: data.pr.title,
    content: Buffer.from(yaml).toString("base64"),
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

  return pr.html_url;
}

