// Version 1
// import React, {useState} from 'react';
// import axios from 'axios';
// import './App.css';
//
// function App() {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//
//     const sendMessage = async () => {
//         if (input.trim() === '') {
//             return;
//         }
//
//         const userMessage = {text: input, sender: 'user'};
//         setMessages([...messages, userMessage]);
//
//         try {
//             const response = await axios.post('http://localhost:9000/api/chat', {message: input});
//             const botReply = response.data.reply;
//
//             // Check if the reply contains 'Explanation:'
//             let questionPart = botReply;
//             let explanationPart = '';
//
//             if (botReply.includes('Explanation:')) {
//                 [questionPart, explanationPart] = botReply.split('Explanation:');
//             }
//
//             const botMessage = {
//                 questionPart: questionPart.trim(),
//                 explanationPart: explanationPart.trim(),
//                 sender: 'bot'
//             };
//             setMessages(prevMessages => [...prevMessages, botMessage]);
//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//
//         setInput('');
//     };
//
//     const clearChat = () => {
//         setMessages([]);
//         console.log('Chat cleared');
//     };
//
//     return (
//         <div className="App">
//             <div className="chat-window">
//                 {messages.map((msg, index) => (
//                     <div key={index} className={`chat-message ${msg.sender}`}>
//                         {msg.sender === 'user' ? (
//                             msg.text
//                         ) : (
//                             <>
//                                 <div className="question-part">{msg.questionPart}</div>
//                                 <div className="explanation-part">{msg.explanationPart}</div>
//                             </>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             <div className="input-area">
//                 <input
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                     placeholder="Type a message..."
//                 />
//                 <button onClick={sendMessage}>Send</button>
//                 <button onClick={clearChat} className="clear-button">Clear Chat</button>
//             </div>
//         </div>
//     );
// }
//
// export default App;

// Version 2
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') {
            return;
        }

        const userMessage = { text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);

        try {
            const response = await axios.post('http://localhost:9000/api/chat', { message: input });
            const botReply = response.data.reply;

            const botMessage = parseBotReply(botReply);
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prevMessages => [...prevMessages, { sender: 'bot', error: 'Error fetching response' }]);
        }

        setInput('');
    };

    const parseBotReply = (botReply) => {
        const sections = botReply.split('\n\n');
        if (sections.length < 4) { // Changed from 3 to 4
            return { sender: 'bot', error: 'Unexpected reply format' };
        }

        const parseWineDetails = (wineSection) => {
            const details = {};
            wineSection.split('\n').forEach(line => {
                const [key, value] = line.split(': ');
                if (key && value) {
                    details[key.trim()] = value.trim();
                }
            });
            return details;
        };

        const wine1 = parseWineDetails(sections[1]); // Changed from 0 to 1
        const wine2 = parseWineDetails(sections[2]); // Changed from 1 to 2
        const analysis = sections[4].replace('AI Recommendation:', '').trim(); // Changed from 2 to 3

        return {
            sender: 'bot',
            wine1,
            wine2,
            analysis
        };
    };

    const clearChat = () => {
        setMessages([]);
    };

    const renderWineDetails = (wine) => (
        <div className="wine-details">
            <h4>{wine.Wine}</h4>
            <p><strong>Winery:</strong> {wine.Winery}</p>
            <p><strong>Variety:</strong> {wine.Variety}</p>
            <p><strong>Country:</strong> {wine.Country}</p>
            <p><strong>Region:</strong> {wine.Region}</p>
            <p><strong>Rating:</strong> {wine.Rating}</p>
            <p><strong>Price:</strong> {wine.Price}</p>
            <p><strong>Description:</strong> {wine.Description}</p>
            <p><strong>Taster:</strong> {wine.Taster}</p>
        </div>
    );

    return (
        <div className="App">
            <h1>Wine Comparison Chat</h1>
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.sender === 'user' ? (
                            <div className="user-message">{msg.text}</div>
                        ) : msg.error ? (
                            <div className="error-message">{msg.error}</div>
                        ) : (
                            <div className="bot-message">
                                <div className="wine-comparison">
                                    <div className="wine-column">
                                        <h3>Wine 1</h3>
                                        {renderWineDetails(msg.wine1)}
                                    </div>
                                    <div className="wine-column">
                                        <h3>Wine 2</h3>
                                        {renderWineDetails(msg.wine2)}
                                    </div>
                                </div>
                                <div className="analysis">
                                    <h3>Analysis</h3>
                                    <p>{msg.analysis}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Compare two wines (e.g., 'Merlot or Cabernet Franc?')"
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={clearChat} className="clear-button">Clear Chat</button>
            </div>
        </div>
    );
}

export default App;