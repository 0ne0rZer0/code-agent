import React, { useState, useEffect } from 'react';
import { render, Text, Box, useInput } from 'ink';
import { Message } from '@code-agent/types';
import { ClaudeAPIService } from '@code-agent/services';
import Spinner from 'ink-spinner';

var STREAMING_RESPONSE = "Hello from Code Agent! This is a streaming message simulation."
const messages: Message[] = [];

const App = () => {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [streaming, setStreaming] = useState(false)
    const [streamIndex, setStreamIndex] = useState(0)
    const [callingAgent, setCallingAgent] = useState(false)

    // User input 
    useInput((inputChar: string, key: any) => {
        if (key.return) {
            // Stream if already not streaming and input exists
            if (!streaming && input.trim().length > 0) {
                setCallingAgent(true)
                setStreaming(true);
                setStreamIndex(0);
                setResponse('')
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
        // if (streaming && streamIndex < STREAMING_RESPONSE.length) {
        //     // fake stream the text
        //     const timeout = setTimeout(() => {
        //         setResponse((prev) => prev + STREAMING_RESPONSE[streamIndex]);
        //         setStreamIndex((prev) => prev + 1);
        //     }, 50);

        //     return () => clearTimeout(timeout); // why? 
        if (streaming && !callingAgent) {
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
        }
    }, [streaming, callingAgent]);
    
    useEffect(() => {
        if (callingAgent) {
            const fetchResponse = async () => {
                const service = new ClaudeAPIService();
                const aiResponse = await service.sendMessage(input);
                setResponse(aiResponse);
                setCallingAgent(false);
                setStreaming(true);
                setStreamIndex(0);
            };

            fetchResponse();
        }
    }, [callingAgent])

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
                <Text color="cyan">Code Agent: </Text> 
                { callingAgent ? (
                    <Text><Spinner type="dots" /></Text>
                ) : (
                <Text>{response}</Text>
                )}
            </Box>}
            {!streaming && (
                <Box marginTop={1}>
                    <Text dimColor>Type and hit enter to chat with Code Agent</Text>
                </Box>
            )}
        </Box>
    );
};

render(<App />);

// method to render human or AI messages depending on message role with timestamp
function renderMessage(message: Message) {
    return (
        <Box key={message.id} flexDirection="column" padding={0}>
            <Box marginBottom={1}>
                <Text color={message.role === "user" ? "green" : "cyan"}>{message.role === "user" ? "You" : "Code Agent"}: </Text>
                <Text>{message.content}</Text>
            </Box>
            { message.role === "assistant" &&
                <Box flexDirection="column" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false}>
                    <Text dimColor>{message.timestamp.toLocaleString()}</Text>
                </Box>
            }
        </Box>
    );
}