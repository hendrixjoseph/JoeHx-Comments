export interface TransformedData {
  branchName: string;
  commitMessage: string;
  filePath: string;
  content: string;
  title: string;
  body: string;
}

export function transformData(formData: Record<string, any>): TransformedData {
  return {
    branchName: `update-${Date.now()}`,
    commitMessage: "Auto PR from form submission",
    filePath: "data/submission.json",
    content: JSON.stringify(formData, null, 2),
    title: "New Form Submission PR",
    body: "This PR was automatically created from form input.",
  };
}
