import React, { useState, useEffect } from 'react';
import { render, Text, Box, useInput } from 'ink';

var STREAMING_RESPONSE  = "Hello from Code Agent! This is a streaming message simulation. You said: "

const App = () => {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [streaming, setStreaming] = useState(false)
    const [streamIndex, setStreamIndex] = useState(0)

    // from ink, behaviour on input
    useInput((inputChar, key) => {
        if (key.return) {
            STREAMING_RESPONSE = STREAMING_RESPONSE + input
            // Stream if already not streaming and input exists
            if (!streaming && input.trim().length > 0) {
                setStreaming(true);
                setStreamIndex(0);
                setResponse('') // to clear for next response
                setInput('')    
            }
        } else if(!streaming) {
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


    // from React, to execute on Render
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
            setStreaming(false)
            setInput('');
        }
    }, [streaming, streamIndex]);
    
    return (
    <Box flexDirection="column" padding={1}>
        <Box>
        <Text color="green">You: </Text><Text>{input}</Text>
        </Box>
        <Box marginTop={1}>
        <Text color="cyan">Code Agent: </Text><Text>{response}</Text>
        </Box>
        {!streaming && (
        <Box marginTop={1}>
            <Text dimColor>Type and hit enter to simulate streaming response</Text>
        </Box>
        )}
    </Box>
    );
};

render(<App />);
    