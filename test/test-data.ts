import { BlogComment } from "../src/transform";

export function getCompleteComment() {
    const comment: BlogComment = {
        options: {
            origin: "https://www.joehxblog.com/blog-post/",
            redirect: "https://www.joehxblog.com/blog-post/",
            slug: "blog-post"
        },
        fields: {
            name: "JoeHx",
            email: "joehx@example.com",
            url: "https://www.joehxblog.com/",
            message: "this is my comment"
        }
    };

    return comment;
}