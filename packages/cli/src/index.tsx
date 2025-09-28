import React, { useState, useEffect } from 'react';
import { render, Text, Box, useInput } from 'ink';
import { Message } from '@code-agent/types';
import Spinner from 'ink-spinner';
import { SessionManager } from '@code-agent/core';

const sessionManager = new SessionManager();

const App = () => {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [streaming, setStreaming] = useState(false)
    const [callingAgent, setCallingAgent] = useState(false)

    // User input 
    useInput((inputChar: string, key: any) => {
        if (key.return) {
            if (!streaming && input.trim().length > 0) {
                setCallingAgent(true)
                setStreaming(true);
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

    useEffect(() => {
        if (streaming && !callingAgent) {
            setStreaming(false)
            setInput('');
        }
    }, [streaming, callingAgent]);
    
    useEffect(() => {
        if (callingAgent) {
            const fetchResponse = async () => {
                const aiResponse = await sessionManager.sendMessage(input)
                setResponse(aiResponse.content);
                setCallingAgent(false);
                setStreaming(true);
            };

            fetchResponse();
        }
    }, [streaming , callingAgent])

    const sessionChat = sessionManager.getConversationHistory().map((message: Message) => (
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