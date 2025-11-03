import crypto from "crypto";

export interface BlogComment {
  options: {
    origin: string;
    redirect: string;
    slug: string;
  };
  fields: {
    name: string;
    email: string;
    url?: string;
    message: string;
  };
}

export interface TransformedData {
  pr: {
    branch: string,
    path: string,
    title: string,
    body: string
  }, 
  comment: {
    message: string,
    name: string,
    email: string,
    url?: string,
    date: number
  }
}

const hash = (string: string) => crypto.createHash("md5").update(string.trim().toLowerCase()).digest("hex");

export function transformData(comment: BlogComment): TransformedData {
    const now = new Date();

    return {
        pr: {
            branch: `comment-${crypto.randomUUID()}`,
            path: `_data/comments/${comment.options.slug}/entry${now.getTime()}.yml`,
            title: `Add comment from ${comment.fields.name} at ${comment.fields.url}.`,
            body: `Add comment from ${comment.fields.name} at ${comment.fields.url}.`
        },
        comment: {
            message: comment.fields.message,
            name: comment.fields.name,
            email: hash(comment.fields.email),
            url: comment.fields.url,
            date: now.getTime()
        }
    }
}
