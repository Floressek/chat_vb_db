import express from 'express';
import cors from 'cors';
import weaviate from 'weaviate-ts-client';

const app = express();
app.use(cors());
app.use(express.json());

const weaviateApiKey = 'fjmSuapKusq6qLuzbg1xeEo2ucZzh9p7IdEX';
const openAiApiKey = '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';

const client = weaviate.client({
    scheme: 'https',
    host: 'zr63g5ynrcio2dfumhgp8g.c0.europe-west3.gcp.weaviate.cloud',
    apiKey: new weaviate.ApiKey(weaviateApiKey),
    headers: {
        'X-OpenAI-Api-Key': openAiApiKey,
    }
});


app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    console.log(`Received user message: ${userMessage}`);

    try {
        const result = await client.graphql.get()
            .withClassName('WeaviateQuestions_v82')
            .withFields(['question', 'answer', 'category'])
            .withNearText({concepts: [userMessage]})
            .withGenerate({singlePrompt: `Explain {answer} as you might to a fellow professional in the field of {category} but try to use information from the {question} and {answer}`})
            .withLimit(1)
            .do();

        console.log('Weaviate result:', JSON.stringify(result, null, 2));

        if (result.data?.Get?.WeaviateQuestions_v82?.length > 0) {
            const matchedData = result.data.Get.WeaviateQuestions_v82[0];
            const botReply = `Question: ${matchedData.question} \nAnswer: ${matchedData.answer}\nCategory: ${matchedData.category}\n\nExplanation: ${matchedData._additional.generate.singleResult}`;
            console.log(`Bot reply: ${botReply}`);
            res.json({ reply: botReply });
        } else {
            console.log('No data found in Weaviate result.');
            res.json({ reply: 'Sorry, I couldn\'t find an answer to your question.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
