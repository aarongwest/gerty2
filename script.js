console.log("Script loaded");

// Theme switching functionality
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);

async function sendMessage() {
    console.log("sendMessage function called");
    const userInput = document.getElementById('user-input');
    const message = userInput.value;
    userInput.value = '';

    appendToTerminal(`> ${message}`, 'user-text');

    try {
        console.log("Sending request to API");
        const response = await fetch('/api/anthropic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
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