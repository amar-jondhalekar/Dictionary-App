// get input 
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '4cae68e5-0dae-4c8a-8458-10d73c31224a';

// add eventlistener 

searchBtn.addEventListener('click', function(e){
    // to prevent refresh page 
    e.preventDefault();
    
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
    // Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await response.json();

    console.log(data);
}