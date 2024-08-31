console.log("Script loaded");

// Use this line instead of directly accessing process.env
const API_KEY = window.ENV_VARS ? window.ENV_VARS.ANTHROPIC_API_KEY : '';

async function sendMessage() {
    console.log("sendMessage function called");
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    userInput.value = '';

    appendToTerminal(`> ${message}`, 'user-text');

    try {
        console.log("Sending request to API");
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            })
        });

        console.log("Response received:", response);

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorData}`);
        }

        const data = await response.json();
        console.log("Parsed response data:", data);

        if (data.content && data.content[0] && data.content[0].text) {
            appendToTerminal(data.content[0].text, 'ai-text');
        } else {
            throw new Error('Unexpected API response format');
        }
    } catch (error) {
        console.error('Error:', error);
        appendToTerminal(`An error occurred: ${error.message}`, 'ai-text');
    }
}

function appendToTerminal(text, className) {
    console.log("Appending to terminal:", text);
    const output = document.getElementById('output');
    const div = document.createElement('div');
    div.textContent = text;
    div.className = className;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

console.log("Adding event listener");
document.getElementById('user-input').addEventListener('keypress', function(event) {
    console.log("Key pressed:", event.key);
    if (event.key === 'Enter') {
        sendMessage();
    }
});