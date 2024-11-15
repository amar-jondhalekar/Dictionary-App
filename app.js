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
    loading.style.display = 'block';
    notFound.style.display = 'none';
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
            updateRecentWords(word);
            displayWordData(wordData);
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

    definitionBox.innerText = definition;
    phoneticBox.innerText = `Phonetic: ${phonetic}`;
    exampleBox.innerText = `Example: ${example}`;
    synonymsBox.innerHTML = synonyms.length ? `<strong>Synonyms:</strong> ${synonyms.join(', ')}` : 'No synonyms found.';
    antonymsBox.innerHTML = antonyms.length ? `<strong>Antonyms:</strong> ${antonyms.join(', ')}` : 'No antonyms found.';
    audioBox.innerHTML = audioUrl ? `<audio controls><source src="${audioUrl}" type="audio/mp3"></audio>` : 'No audio available.';

    // Hide loading and "word not found" messages, display results
    loading.style.display = 'none';
    notFound.style.display = 'none';
}

searchBtn.addEventListener('click', () => {
    const word = input.value.trim();
    if (word) fetchWordData(word);
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = input.value.trim();
        if (word) fetchWordData(word);
    }
});

darkModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Initialize UI with recent and favorite words
renderRecentWords();
renderFavoriteWords();
setWordOfTheDay();
