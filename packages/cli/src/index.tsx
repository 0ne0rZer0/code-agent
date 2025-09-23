import React, { useState, useEffect } from 'react';
import { render, Text, Box, useInput } from 'ink';
import { Message } from '@code-agent/types';

var STREAMING_RESPONSE = "Hello from Code Agent! This is a streaming message simulation."
const messages: Message[] = [];

const App = () => {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [streaming, setStreaming] = useState(false)
    const [streamIndex, setStreamIndex] = useState(0)

    // User input 
    useInput((inputChar: string, key: any) => {
        if (key.return) {
            // Stream if already not streaming and input exists
            if (!streaming && input.trim().length > 0) {
                setStreaming(true);
                setStreamIndex(0);
                setResponse('') // to clear for next response
            }
        } else if (!streaming) {
            // Take input
            if (key.backspace || key.delete) {
                // delete
                setInput((prev) => prev.slice(0, -1));
            } else {
                //  take
                setInput((prev) => prev + inputChar);
            }
        }
    });

    // AI Response
    useEffect(() => {
        // if streaming and text left
        if (streaming && streamIndex < STREAMING_RESPONSE.length) {
            // fake stream the text
            const timeout = setTimeout(() => {
                setResponse((prev) => prev + STREAMING_RESPONSE[streamIndex]);
                setStreamIndex((prev) => prev + 1);
            }, 50);

            return () => clearTimeout(timeout); // why? 
        } else if (streaming) {
            const newUserMessage: Message = {
                id: crypto.randomUUID(),
                role: "user",
                content: input,
                timestamp: new Date()
            };
            messages.push(newUserMessage)
            const newAIMessage: Message = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response,
                timestamp: new Date()
            };
            messages.push(newAIMessage)
            setStreaming(false)
            setInput('');
            setResponse('');
        }
    }, [streaming, streamIndex]);

    const sessionChat = messages.map((message: Message) => (
        <Box key={message.id} flexDirection="column" padding={0}>
            {renderMessage(message)}
        </Box>
    ))


    return (
        <Box flexDirection="column" padding={1}>
            {sessionChat}
            <Box>
                <Text color="green">You: </Text><Text>{input}</Text>
            </Box>
            {streaming && <Box marginTop={1}>
                <Text color="cyan">Code Agent: </Text><Text>{response}</Text>
            </Box>}
            {!streaming && (
                <Box marginTop={1}>
                    <Text dimColor>Type and hit enter to simulate streaming response</Text>
                </Box>
            )}
        </Box>
    );
};

render(<App />);

// method to render human or AI messages depending on message role with timestamp
function renderMessage(message: Message) {
    return (
        <Box key={message.id} flexDirection="column" padding={0} marginTop={message.role !== "user"? 1 : 0}>
            <Box>
                <Text color={message.role === "user" ? "green" : "cyan"}>{message.role === "user" ? "You" : "Code Agent"}: </Text>
                <Text>{message.content}</Text>
            </Box>
            <Box>
                {message.role === "assistant" && <Text dimColor>{message.timestamp.toLocaleString()}</Text>}
            </Box>
        </Box>
    );
}