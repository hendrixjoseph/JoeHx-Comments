import { validateComment } from "../src/validation.js";
import { getCompleteComment } from "./test-data.js";

describe('test validations!', () => {
    it('test missing fields', async () => {
        await expect(validateComment({})).rejects.toBe("blog comment is missing fields!");
    });

    it('test not https', async () => {
        const comment = getCompleteComment();
        comment.fields.url = "http://www.joehxblog.com"

        await expect(validateComment(comment)).rejects.toBe("Website URL must be https.");
    });

    describe('test not english', () => {        
        [[ 
            'これは英語ではありません',
             'Japanese'
        ], [
            'Лорем ипсум долор сит амет, те при ипсум солет промпта. Ех хабео еффициенди сеа. Ех солум дицтас молестие мел, иус лорем диссентиас ад? Велит еирмод вел еи? Поссит патриояуе мел ат, мелиоре яуалисяуе цу яуо. Дицо пробо цотидиеяуе нам ут, еам ад мунере лаборес. Some English.',
             'Cyrillic'
        ], [
            'Λορεμ ιπσθμ δολορ σιτ αμετ, cθμ ιθστο ομνεσ σολετ θτ, εριπθιτ περφεcτο νεγλεγεντθρ vιμ αν? Ιδ σολεατ διcερετ εθμ, αδ δεβετ γραεcι εξπετενδα εαμ, εθ νθσqθαμ αδιπισcινγ εθμ. Vιμ ιν εσσε ταcιματεσ, μεα μοδο οπορτεατ τε! Ομνιθμ λαβοραμθσ vιμ εξ, vιξ ταλε ρεcθσαβο vιτθπερατα εα! Εξ αεqθε ηαρθμ πετεντιθμ vιμ, γραεcισ περcιπιτ cθμ εθ. Εστ qθανδο σεντεντιαε σιγνιφερθμqθε αν, απειριαν λαβοραμθσ περcιπιτθρ ιδ. Some English.',
            'Greek'
        ]].forEach(([message, language]) => {
            it(`message with ${language} characters`, async () => {
                const comment = getCompleteComment();
                comment.fields.message = message;

                await expect(validateComment(comment)).rejects.toBe("english only");
            });
        })
    });

    it('test banned domain', async () => {
        const comment = getCompleteComment();
        comment.fields.url = "https://bit.ly";

        await expect(validateComment(comment)).rejects.toBe("banned domain!");
    });

    describe('test bad emails', () => {
        it('test invalid format', async () => {
            const comment = getCompleteComment();
            comment.fields.email = "this is not an email";

            await expect(validateComment(comment)).rejects.toBe("invalid email");
        });

        it('test banned domain', async () => {
            const comment = getCompleteComment();
            comment.fields.email = "joe@bit.ly";

            await expect(validateComment(comment)).rejects.toBe("email has banned domain!");
        });
    });

    it('test too many links', async () => {
        const comment = getCompleteComment();
        comment.fields.message = 'http://www.example.com and https://www.example.com '.repeat(6);

        await expect(validateComment(comment)).rejects.toBe("Too many attempted links.");
    });

    it('test valid comment', async () => {
        const comment = getCompleteComment();

        await expect(validateComment(comment)).resolves.toBeUndefined();
    });
});

