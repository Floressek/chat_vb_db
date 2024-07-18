import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import {logDOM} from "@testing-library/react";

function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = async () => {
        if (input.trim() === '') {
          return;
        }

        const userMessage = { text: input, sender: 'user' };
        setMessages([...messages, userMessage]);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { message: input });
            const botReply = response.data.reply;

            // Parse the bot's reply
            const [questionPart, explanationPart] = botReply.split('Explanation:');

            const botMessage = {
                questionPart: questionPart.trim(),
                explanationPart: explanationPart.trim(),
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
    };

    const clearChat = () => {
        setMessages([]);
        console.log('Chat cleared');
    };

    return (
        <div className="App">
            <div className="chat-window">
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.sender}`}>
                        {msg.sender === 'user' ? (
                            msg.text
                        ) : (
                            <>
                                <div className="question-part">{msg.questionPart}</div>
                                <div className="explanation-part">{msg.explanationPart}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
                <button onClick={clearChat} className="clear-button">Clear Chat</button>
            </div>
        </div>
    );
}

export default App;