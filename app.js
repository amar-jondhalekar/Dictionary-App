// get input 
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '4cae68e5-0dae-4c8a-8458-10d73c31224a';
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');

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
    /// if empty result 
    if(!data.length){
        notFound.innerText = 'No result found';
        return  
    }

    // If result is suggetions  
    if(typeof data[0] === 'string'){
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggetion = document.createElement('span');
            suggetion.classList.add('suggested');
            suggetion.innerText = element;
            notFound.appendChild(suggetion);
        })
        return;
    }

    // Result found
    let defination = data[0].shortdef[0];
    defBox.innerText = defination;


    // Sound 
    const soundName = data[0].hwi.prs[0].sound.audio;
    if(soundName){
        renderSound(soundName);
    }

    console.log(data);
}

function renderSound(soundName){
    //https://media.marriam-webster.com/soundc11
    let subfolder = soundName

}