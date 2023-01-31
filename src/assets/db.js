// eslint-disable-next-line @typescript-eslint/no-var-requires
const LoremIpsum = require('lorem-ipsum').LoremIpsum;

function generateRandomDate() {
    const start = new Date(2022, 8, 1).getTime();
    const end = Date.now();
    return new Date(start + Math.random() * (end - start)).getTime();
}

const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});


module.exports = () => {
    const data = { messages: [] };
    for (let i = 0; i < 1000; i++) {
        data.messages.push({
            id: i,
            username: `${lorem.generateWords(1)}${i}`,
            datetime: generateRandomDate(),
            message: lorem.generateSentences(5)
        });
    }
    return data;
};