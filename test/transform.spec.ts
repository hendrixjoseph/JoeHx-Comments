import { transformData, TransformedData } from "../src/transform";
import { getCompleteComment } from "./test-data";
import crypto from "crypto";

describe('test tranforms!', () => {
    beforeAll(() => {
        const fixedDate = new Date("2018-03-26T14:56:00Z");
        jest.useFakeTimers().setSystemTime(fixedDate);
        jest.spyOn(crypto, "randomUUID").mockReturnValue("this-is-a-random-uuid");
    });

    afterAll(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('test transform', () => {
        const comment = getCompleteComment();

        const tranformedData = transformData(comment);

        const expectedData: TransformedData = {
            pr: {
                body: "Add comment from JoeHx at https://www.joehxblog.com/.",
                branch: "comment-this-is-a-random-uuid",
                path: "_data/comments/blog-post/entry1522076160000.yml",
                title: "Add comment from JoeHx at https://www.joehxblog.com/.",
            },
            comment: {
                date: 1522076160000,
                email: "61cfa8e9f8b424f0d22b79e08a72c860",
                message: "this is my comment",
                name: "JoeHx",
                url: "https://www.joehxblog.com/",
            }
        };

        expect(tranformedData).toEqual(expectedData);
    });
});