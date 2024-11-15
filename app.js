// get input 
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '4cae68e5-0dae-4c8a-8458-10d73c31224a';
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let readButton;  // declare readButton to be used later

// add eventlistener 
searchBtn.addEventListener('click', function(e){
    // to prevent refresh page 
    e.preventDefault();
    
    // clear old data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';
    if (readButton) {
        readButton.remove();  // remove old button if it exists
    }

    // Get input data 
    let word = input.value;

    // call API get data 
    if(word === ''){
        alert('Word is required');
        return;
    }

    getData(word);
});

async function getData(word){
    loading.style.display = 'block';
    // Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await response.json();
    console.log(data);

    // if empty result 
    if(!data.length){
        loading.style.display = 'none';
        notFound.innerText = 'No result found';
        return;  
    }

    // If result is suggestions  
    if(typeof data[0] === 'string'){
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        })
        return;
    }

    // Result found
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    // Add Read Definition button
    readButton = document.createElement('button');
    readButton.innerText = 'Read Definition';
    readButton.classList.add('read-button');
    defBox.appendChild(readButton);

    // Add event listener to read the definition out loud
    readButton.addEventListener('click', () => {
        let utterance = new SpeechSynthesisUtterance(definition);
        speechSynthesis.speak(utterance);
    });

    // Sound 
    const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName){
        renderSound(soundName);
    }
}

function renderSound(soundName){
    // Updated URL format for the audio file
    let soundSrc = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${soundName.charAt(0)}/${soundName}.mp3`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}
