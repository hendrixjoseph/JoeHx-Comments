import { BANNED_DOMAINS } from "./constants.js";
import { BlogComment } from "./transform.js";

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}

export async function validateComment(comment: RecursivePartial<BlogComment>) {
    const c = await fieldsPresent(comment);

    return await Promise.all([
        requireHttps(c),
        requireEnglish(c),
        validateUrl(c),
        validateEmail(c)
    ]);
}

function requireHttps(comment: BlogComment) {
  if (comment.fields.url && comment.fields.url.startsWith('https')) {
    return Promise.resolve();
  } else {
    return Promise.reject('Website URL must be https.');
  }
}

function requireEnglish(comment: BlogComment) {  
  const english = comment.fields.message.match(/[ -~]/g);

  const numberOfCharacters = english ? english.length : 0;

  let percent = numberOfCharacters / comment.fields.message.length;

  if (percent > 0.9) {
    return Promise.resolve();
  } else {
    return Promise.reject('english only');
  }
}

function validateUrl(comment: BlogComment) {
    if (comment.fields.url && hasBannedDomain(comment.fields.url)) {
        return Promise.reject('banned domain!');
    } else {
        return Promise.resolve();
    }
}

function hasBannedDomain(string: string) {
    return BANNED_DOMAINS.some(domain => string.includes(domain));
}

function validateEmail(comment: BlogComment) {
    const re = /^\S+@\S+\.\S+$/;

    const email = comment.fields.email.trim();
    
    if (!re.test(email.trim())) {
        return Promise.reject("invalid email");
    }

    if (hasBannedDomain(email)) {
        return Promise.reject('email has banned domain!');
    }

    return Promise.resolve();
}

function preventTooManyLinks(comment: BlogComment) {

  const count = comment.fields.message.match(/http/gi);

  if (count && count.length > 10) {
    return Promise.reject('Too many attempted links.');
  } else {
    return Promise.resolve();
  }
}

function fieldsPresent(comment: RecursivePartial<BlogComment>)  {
    if (comment.fields) {
        if (comment.fields.message && comment.fields.name && comment.fields.email) {
            if (comment.options) {
                if (comment.options.slug && comment.options.origin && comment.options.redirect) {
                    return Promise.resolve(comment as BlogComment);
                }
            }
        }
    }

    return Promise.reject("blog comment is missing fields!");
}