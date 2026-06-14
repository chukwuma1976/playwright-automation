import test from "@playwright/test"

test.describe('Parse text file content', () => {
    test("Parse a text file content and return an array of lines", async ({ request }) => {
        const response = await fetch("https://public.karat.io/content/referrals_4.txt");
        const result = await response.text();
        const lines = result.trim().split("\n");
        console.log(lines[0]);
        console.log(lines[1]);
        console.log(getURLfragments(lines, 0));
        console.log(getURLfragments(lines, 1));
    });

    test("Parse some text and do some stats", async ({ request }) => {
        const fileUrl = "https://www.gutenberg.org/files/5/5-0.txt";
        console.log(await processOnlineTextFile(fileUrl));
    })

    function getURLfragments(url: string[], index: number): string[] {
        const withoutProtocol = url[index].replace(/https?:\/\//, "");
        const hostname = withoutProtocol.split("/")[0];
        const parts = hostname.split(".");
        const secondLevel = parts.slice(-2).join(".");
        return [hostname, secondLevel];
    }

    async function processOnlineTextFile(fileUrl: string): Promise<any> {
        const response = await fetch(fileUrl);
        const text = await response.text();
        const lines = text.trim().split("\n");
        const numberOfLines = lines.length;

        const wordsArray: string[] = [];
        let wordCount = 0;
        lines.forEach(line => {
            const words = line.toLowerCase().split(" ");
            wordCount += words.length;
            wordsArray.push(...words);
        })

        const wordMap: { [key: string]: number } = {};
        const sanitizedWords = wordsArray.map(word => word.replace(/[^a-z0-9]/g, '')).sort();
        sanitizedWords.forEach(word => {
            wordMap[word] = (wordMap[word] || 0) + 1;
        });

        return { numberOfLines, wordCount, text, wordMap };
    }

})