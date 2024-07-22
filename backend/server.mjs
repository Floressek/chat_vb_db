// import express from 'express';
// import cors from 'cors';
// import weaviate from 'weaviate-ts-client';
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// const weaviateApiKey = 'fjmSuapKusq6qLuzbg1xeEo2ucZzh9p7IdEX';
// const openAiApiKey = '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';
//
// const client = weaviate.client({
//     scheme: 'https',
//     host: 'zr63g5ynrcio2dfumhgp8g.c0.europe-west3.gcp.weaviate.cloud',
//     apiKey: new weaviate.ApiKey(weaviateApiKey),
//     headers: {
//         'X-OpenAI-Api-Key': openAiApiKey,
//     }
// });
//
//
// app.post('/api/chat', async (req, res) => {
//     const userMessage = req.body.message;
//     console.log(`Received user message: ${userMessage}`);
//
//     try {
//         const result = await client.graphql.get()
//             .withClassName('WeaviateQuestions_v82')
//             .withFields(['question', 'answer', 'category'])
//             .withNearText({concepts: [userMessage]})
//             .withGenerate({singlePrompt: `Explain {answer} as you might to a fellow professional in the field of {category} but try to use information from the {question} and {answer}`})
//             .withLimit(1)
//             .do();
//
//         console.log('Weaviate result:', JSON.stringify(result, null, 2));
//
//         if (result.data?.Get?.WeaviateQuestions_v82?.length > 0) {
//             const matchedData = result.data.Get.WeaviateQuestions_v82[0];
//             const botReply = `Question: ${matchedData.question} \nAnswer: ${matchedData.answer}\nCategory: ${matchedData.category}\n\nExplanation: ${matchedData._additional.generate.singleResult}`;
//             console.log(`Bot reply: ${botReply}`);
//             res.json({ reply: botReply });
//         } else {
//             console.log('No data found in Weaviate result.');
//             res.json({ reply: 'Sorry, I couldn\'t find an answer to your question.' });
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
//
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//V2 Wine edition

// import express from 'express';
// import cors from 'cors';
// import weaviate from 'weaviate-ts-client';
//
// const app = express();
// app.use(cors());
// app.use(express.json());
//
// const weaviateApiKey = 'fjmSuapKusq6qLuzbg1xeEo2ucZzh9p7IdEX';
// const openAiApiKey = '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';
//
// const client = weaviate.client({
//     scheme: 'https',
//     host: 'zr63g5ynrcio2dfumhgp8g.c0.europe-west3.gcp.weaviate.cloud',
//     apiKey: new weaviate.ApiKey(weaviateApiKey),
//     headers: {
//         'X-OpenAI-Api-Key': openAiApiKey,
//     }
// });
//
// app.post('/api/chat', async (req, res) => {
//     let userMessage = req.body.message;
//     console.log(`Received user message: ${userMessage}`);
//
//     if (!userMessage || userMessage.trim() === '') {
//         return res.json({reply: 'Please provide a query about wine.'});
//     }
//
//     try {
//         const result = await client.graphql
//             .get()
//             .withClassName('WeaviateWines_v40')
//             .withFields('title description variety country points price winery province region_1 taster_name taster_twitter_handle')
//             .withNearText({concepts: [userMessage]})
//             .withLimit(1)
//             .do();
//
//         console.log('Weaviate result:', JSON.stringify(result, null, 2));
//
//         if (result.data?.Get?.WeaviateWines_v40?.length > 0) {
//             const wine = result.data.Get.WeaviateWines_v40[0];
//             const botReply = `
// Wine: ${wine.title}
// Winery: ${wine.winery}
// Variety: ${wine.variety}
// Country: ${wine.country}
// Region: ${wine.region_1 || wine.province}
// Rating: ${wine.points} points
// Price: $${wine.price}
//
// Description: ${wine.description}
//
// Taster: ${wine.taster_name} (${wine.taster_twitter_handle})
//
// Analysis: Based on your query "${userMessage}", this ${wine.variety} from ${wine.country} might be a good choice.
// It's a ${wine.points}-point wine, indicating ${getQualityDescription(wine.points)}. Priced at $${wine.price},
// it offers ${getPriceValueDescription(wine.points, wine.price)}. The wine is from the ${wine.region_1 || wine.province} region,
// known for ${getRegionDescription(wine.country, wine.region_1 || wine.province)}. ${wine.taster_name}'s description
// highlights ${getHighlights(wine.description)}.
//             `;
//             console.log(`Bot reply: ${botReply}`);
//             res.json({reply: botReply});
//         } else {
//             console.log('No data found in Weaviate result.');
//             res.json({reply: 'Sorry, I couldn\'t find a wine matching your query.'});
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({error: 'Internal Server Error', details: error.message});
//     }
// });
//
// function getQualityDescription(points) {
//     if (points >= 95) return "exceptional quality";
//     if (points >= 90) return "outstanding quality";
//     if (points >= 85) return "very good quality";
//     if (points >= 80) return "good quality";
//     return "average quality";
// }
//
// function getPriceValueDescription(points, price) {
//     const ratio = points / price;
//     if (ratio > 1) return "excellent value for money";
//     if (ratio > 0.8) return "good value for money";
//     return "a premium price for its quality";
// }
//
// function getRegionDescription(country, region) {
//     const descriptions = {
//         "France": "producing some of the world's most renowned wines",
//         "Italy": "offering a diverse range of wine styles",
//         "Spain": "known for its bold and flavorful wines",
//         "USA": "producing innovative and high-quality wines",
//         "Portugal": "famous for its Port wines and emerging table wines",
//     };
//     return descriptions[country] || "producing distinctive local wines";
// }
//
// function getHighlights(description) {
//     const keywords = ["fruity", "tannic", "acidic", "balanced", "oak", "spicy", "floral", "mineral", "rich", "light"];
//     const found = keywords.filter(word => description.toLowerCase().includes(word));
//     return found.length > 0 ? found.join(", ") + " notes" : "its unique characteristics";
// }
//
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Version 3
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
    console.log('Received message:', userMessage);

    if (!userMessage || userMessage.trim() === '') {
        return res.json({ reply: 'Please provide a query about wines to compare.' });
    }

    // Extract wine names from the user message
    const [wine1Name, wine2Name] = extractWineNames(userMessage);

    console.log('Extracted wine names:', { wine1Name, wine2Name });

    if (!wine1Name || !wine2Name) {
        return res.json({ reply: 'Please provide two wine names to compare.' });
    }

    try {
        const result = await client.graphql
            .get()
            .withClassName('WeaviateWines_v40')
            .withFields('title description variety country points price winery province region_1 taster_name taster_twitter_handle')
            .withNearText({ concepts: [wine1Name, wine2Name] })
            .withLimit(2)
            .do();

        const wines = result.data?.Get?.WeaviateWines_v40;

        if (wines && wines.length === 2) {
            const [wine1, wine2] = wines;
            const comparisonReply = `
Comparison of Wines:

Wine 1:
Wine: ${wine1.title}
Winery: ${wine1.winery}
Variety: ${wine1.variety}
Country: ${wine1.country}
Region: ${wine1.region_1 || wine1.province}
Rating: ${wine1.points} points
Price: $${wine1.price}
Description: ${wine1.description}
Taster: ${wine1.taster_name} (${wine1.taster_twitter_handle})

Wine 2:
Wine: ${wine2.title}
Winery: ${wine2.winery}
Variety: ${wine2.variety}
Country: ${wine2.country}
Region: ${wine2.region_1 || wine2.province}
Rating: ${wine2.points} points
Price: $${wine2.price}
Description: ${wine2.description}
Taster: ${wine2.taster_name} (${wine2.taster_twitter_handle})

Analysis:
Based on your queries "${wine1.title}" and "${wine2.title}", here is the comparison:
- ${wine1.title} from ${wine1.winery} is a ${wine1.variety} from ${wine1.country} with ${wine1.points} points and priced at $${wine1.price}.
- ${wine2.title} from ${wine2.winery} is a ${wine2.variety} from ${wine2.country} with ${wine2.points} points and priced at $${wine2.price}.
- ${wine1.title} is ${getQualityDescription(wine1.points)} and offers ${getPriceValueDescription(wine1.points, wine1.price)}.
- ${wine2.title} is ${getQualityDescription(wine2.points)} and offers ${getPriceValueDescription(wine2.points, wine2.price)}.
- The ${wine1.variety} from ${wine1.region_1 || wine1.province} is ${getRegionDescription(wine1.country, wine1.region_1 || wine1.province)}.
- The ${wine2.variety} from ${wine2.region_1 || wine2.province} is ${getRegionDescription(wine2.country, wine2.region_1 || wine2.province)}.
- ${wine1.title} has ${getHighlights(wine1.description)}, while ${wine2.title} has ${getHighlights(wine2.description)}.
            `;
            console.log(`Comparison reply: ${comparisonReply}`);
            res.json({ reply: comparisonReply });
        } else {
            console.log('One or both wines not found in Weaviate result.');
            res.json({ reply: 'Sorry, I couldn\'t find wines matching your queries for comparison.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

function extractWineNames(message) {
    const regex = /(.*?)\s+or\s+(.*?)(\?|$)/i;
    const match = message.match(regex);
    if (match) {
        return [match[1].trim(), match[2].trim()];
    }
    return [null, null];
}

function getQualityDescription(points) {
    if (points >= 95) return "exceptional quality";
    if (points >= 90) return "outstanding quality";
    if (points >= 85) return "very good quality";
    if (points >= 80) return "good quality";
    return "average quality";
}

function getPriceValueDescription(points, price) {
    const ratio = points / price;
    if (ratio > 1) return "excellent value for money";
    if (ratio > 0.8) return "good value for money";
    return "a premium price for its quality";
}

function getRegionDescription(country, region) {
    const descriptions = {
        "France": "producing some of the world's most renowned wines",
        "Italy": "offering a diverse range of wine styles",
        "Spain": "known for its bold and flavorful wines",
        "USA": "producing innovative and high-quality wines",
        "Portugal": "famous for its Port wines and emerging table wines",
    };
    return descriptions[country] || "producing distinctive local wines";
}

function getHighlights(description) {
    const keywords = ["fruity", "tannic", "acidic", "balanced", "oak", "spicy", "floral", "mineral", "rich", "light"];
    const found = keywords.filter(word => description.toLowerCase().includes(word));
    return found.length > 0 ? found.join(", ") + " notes" : "its unique characteristics";
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
