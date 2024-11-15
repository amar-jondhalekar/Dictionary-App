const searchBtn = document.getElementById('search-btn');
const input = document.getElementById('search-input');
const wordOfTheDayBox = document.getElementById('word-of-the-day');
const definitionBox = document.getElementById('definition-box');
const phoneticBox = document.getElementById('phonetic-box');
const exampleBox = document.getElementById('example-box');
const synonymsBox = document.getElementById('synonyms-box');
const antonymsBox = document.getElementById('antonyms-box');
const audioBox = document.getElementById('audio-box');
const recentWordsList = document.getElementById('recent-words');
const favoriteWordsList = document.getElementById('favorite-words');
const loading = document.getElementById('loading');
const notFound = document.getElementById('not-found');
const darkModeButton = document.querySelector('.dark-mode-btn');

// Store recent and favorite words in localStorage
function updateRecentWords(word) {
    let recentWords = JSON.parse(localStorage.getItem('recentWords')) || [];
    if (!recentWords.includes(word)) {
        recentWords.unshift(word);
        if (recentWords.length > 5) recentWords.pop();
        localStorage.setItem('recentWords', JSON.stringify(recentWords));
    }
    renderRecentWords();
}

function updateFavoriteWords(word) {
    let favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || [];
    if (!favoriteWords.includes(word)) {
        favoriteWords.push(word);
        localStorage.setItem('favoriteWords', JSON.stringify(favoriteWords));
    }
    renderFavoriteWords();
}

function renderRecentWords() {
    const recentWords = JSON.parse(localStorage.getItem('recentWords')) || [];
    recentWordsList.innerHTML = '';
    recentWords.forEach(word => {
        let li = document.createElement('li');
        li.textContent = word;
        recentWordsList.appendChild(li);
    });
}

function renderFavoriteWords() {
    const favoriteWords = JSON.parse(localStorage.getItem('favoriteWords')) || [];
    favoriteWordsList.innerHTML = '';
    favoriteWords.forEach(word => {
        let li = document.createElement('li');
        li.textContent = word;
        favoriteWordsList.appendChild(li);
    });
}

function setWordOfTheDay() {
    const randomWord = ['cogent', 'ephemeral', 'sagacious', 'euphoria', 'serendipity'];
    const word = randomWord[Math.floor(Math.random() * randomWord.length)];
    wordOfTheDayBox.innerText = word;
}

async function fetchWordData(word) {
    // Show the loading message and hide any previous errors or results
    loading.style.display = 'block';  // Show loading
    notFound.style.display = 'none';  // Hide "not found"
    definitionBox.innerHTML = '';
    phoneticBox.innerHTML = '';
    exampleBox.innerHTML = '';
    synonymsBox.innerHTML = '';
    antonymsBox.innerHTML = '';
    audioBox.innerHTML = '';
   
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (response.ok) {
            const data = await response.json();
            const wordData = data[0];
            updateRecentWords(word); // Update recent words
            displayWordData(wordData); // Display word data
        } else {
            notFound.style.display = 'block'; // Show "Word not found"
            loading.style.display = 'none';   // Hide "Loading"
        }
    } catch (error) {
        notFound.style.display = 'block'; // Show "Word not found"
        loading.style.display = 'none';   // Hide "Loading"
    }
}

function displayWordData(data) {
    const word = data.word;
    const phonetic = data.phonetic || 'N/A';
    const definition = data.meanings[0].definitions[0].definition || 'N/A';
    const example = data.meanings[0].definitions[0].example || 'No example found.';
    const synonyms = data.meanings[0].synonyms || [];
    const antonyms = data.meanings[0].antonyms || [];
    const audioUrl = data.phonetics[0]?.audio || '';

    // Clear previous data and update UI with new word information
    definitionBox.innerText = definition;
    phoneticBox.innerText = phonetic;
    exampleBox.innerText = example;

    if (synonyms.length > 0) {
        synonymsBox.innerHTML = `<strong>Synonyms:</strong> ${synonyms.join(', ')}`;
    } else {
        synonymsBox.innerText = 'No synonyms found.';
    }

    if (antonyms.length > 0) {
        antonymsBox.innerHTML = `<strong>Antonyms:</strong> ${antonyms.join(', ')}`;
    } else {
        antonymsBox.innerText = 'No antonyms found.';
    }

    if (audioUrl) {
        audioBox.innerHTML = `<button onclick="new Audio('${audioUrl}').play()" class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">🔊 Listen</button>`;
    } else {
        audioBox.innerText = 'Audio not available.';
    }

    // Adding a description in table format
    const descriptionTable = `
        <table class="min-w-full border-collapse">
            <thead>
                <tr class="border-b">
                    <th class="px-4 py-2">Property</th>
                    <th class="px-4 py-2">Description</th>
                </tr>
            </thead>
            <tbody>
                <tr class="border-b">
                    <td class="px-4 py-2">Word</td>
                    <td class="px-4 py-2">${word}</td>
                </tr>
                <tr class="border-b">
                    <td class="px-4 py-2">Phonetic</td>
                    <td class="px-4 py-2">${phonetic}</td>
                </tr>
                <tr class="border-b">
                    <td class="px-4 py-2">Definition</td>
                    <td class="px-4 py-2">${definition}</td>
                </tr>
                <tr class="border-b">
                    <td class="px-4 py-2">Example</td>
                    <td class="px-4 py-2">${example}</td>
                </tr>
                <tr class="border-b">
                    <td class="px-4 py-2">Synonyms</td>
                    <td class="px-4 py-2">${synonyms.length > 0 ? synonyms.join(', ') : 'N/A'}</td>
                </tr>
                <tr class="border-b">
                    <td class="px-4 py-2">Antonyms</td>
                    <td class="px-4 py-2">${antonyms.length > 0 ? antonyms.join(', ') : 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    `;
    
    document.getElementById('word-description').innerHTML = descriptionTable;

    loading.style.display = 'none';  // Hide loading
}

searchBtn.addEventListener('click', () => {
    const word = input.value.trim();
    if (word) {
        fetchWordData(word);
        input.value = ''; // Clear the input after search
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Check if the dark mode button exists before adding event listener
    if (darkModeButton) {
        darkModeButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});

// Initialize Word of the Day and Recent/Favorite Words
setWordOfTheDay();
renderRecentWords();
renderFavoriteWords();
