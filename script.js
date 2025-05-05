// Initialize variables

const wordInput = document.getElementById('wordInput');
const searchBtn = document.getElementById('searchBtn');
const micBtn = document.getElementById('micBtn');
const pronounceBtn = document.getElementById('pronounceBtn');
const bookmarkBtn = document.getElementById('bookmarkBtn');
const historyDropdown = document.getElementById('historyDropdown');
const resultSection = document.getElementById('resultSection');
const searchedWord = document.getElementById('searchedWord');
const definitions = document.getElementById('definitions');
const thesaurus = document.getElementById('thesaurus');
const images = document.getElementById('images');

const startQuizBtn = document.getElementById('startQuizBtn');
const quizArea = document.getElementById('quizArea');
const quizQuestion = document.getElementById('quizQuestion');
const quizAnswer = document.getElementById('quizAnswer');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const quizResult = document.getElementById('quizResult');

let currentWord = ''; // Store the current word being searched
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; // Store search history
let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || []; // Store bookmarks
let dictData; // Store dictionary data

document.getElementById('searchBtn').addEventListener('click', () => { // Event listener for the search button
  const word = document.getElementById('wordInput').value.trim(); // Get the word from the input field
  if (word) fetchWordData(word); // Fetch word data if input is not empty
});

document.getElementById('wordInput').addEventListener('keydown', (e) => { // Event listener for the input field
  if (e.key === 'Enter') { // Check if the Enter key is pressed
    const word = e.target.value.trim(); // Get the word from the input field
    if (word) fetchWordData(word); // Fetch word data if input is not empty
  }
});

function updateHistoryDropdown() { // Function to update the search history dropdown
  historyDropdown.innerHTML = ''; // Clear the dropdown
  if (searchHistory.length > 0) { // Check if there are any search history items
    historyDropdown.style.display = 'block'; // Show the dropdown
    searchHistory.slice().reverse().forEach(word => { // Iterate through the search history in reverse order
      const div = document.createElement('div'); // Create a new div for each history item
      div.className = 'history-item'; // Set the class name for styling
      div.innerHTML = `
        <span>${word}</span>
        <button onclick="removeHistory('${word}')">❌</button>
      `;
      div.querySelector('span').addEventListener('click', () => { // Add click event to the word span
        wordInput.value = word; // Set the input value to the clicked word
        fetchWordData(word); // Fetch word data for the clicked word
        historyDropdown.style.display = 'none'; // Hide the dropdown
      }); 
      historyDropdown.appendChild(div); // Append the div to the dropdown
    });
  } else { // If there are no search history items
    historyDropdown.style.display = 'none'; // Hide the dropdown
  }
}

function removeHistory(word) { // Function to remove a word from search history
  searchHistory = searchHistory.filter(w => w !== word); // Filter out the word to be removed
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // Update local storage
  updateHistoryDropdown(); // Update the dropdown to reflect the changes
}

wordInput.addEventListener('focus', updateHistoryDropdown); // Show history dropdown on focus
wordInput.addEventListener('blur', () => { // Hide history dropdown on blur
  setTimeout(() => historyDropdown.style.display = 'none', 200); // Delay to allow click event to register
});

//Retrieval of the search item in the dropdown for easy searching
searchBtn.addEventListener('click', () => { // Event listener for the search button
  const word = wordInput.value.trim(); // Get the word from the input field
  if (word) { // Check if the word is not empty
    fetchWordData(word); // Fetch word data
    if (!searchHistory.includes(word)) { // Check if the word is not already in search history
      searchHistory.push(word); // Add the word to search history
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory)); // Update local storage
    }
  }
});

async function fetchWordData(word) { // Function to fetch word data from APIs
  currentWord = word; // Store the current word
  searchedWord.textContent = word; // Display the searched word
  definitions.innerHTML = ''; // Clear previous definitions
  thesaurus.innerHTML = ''; // Clear previous thesaurus data
  images.innerHTML = ''; // Clear previous images

  resultSection.classList.remove('hidden'); // Show the result section

  // Fetch from Dictionary API
  const dictRes = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${word}`, { // API Key: bvP/UWBSRTwxrfUXfyY/GQ==hE0FVuQMYHIdwgTQ
    headers: { 'X-Api-Key': 'bvP/UWBSRTwxrfUXfyY/GQ==hE0FVuQMYHIdwgTQ' }
  });
   dictData = await dictRes.json(); // Parse the response as JSON which means the data is in JSON format and we are converting it to a JavaScript object
   if (dictData.definition) { // Check if the definition exists
    const defLines = dictData.definition.split(/[1-9]\.|\n/).filter(Boolean); // Split by numbering or new lines
    let formattedDefs = defLines.map(def => { // Map through each definition line
      def = def.trim(); // Trim whitespace
      const exampleMatch = def.match(/"(.*?)"/); // Look for quoted example 
      const definitionText = def.replace(/"(.*?)"/, '').trim(); // Remove the example from the definition text  
  
      let formatted = '';
      if (/^n\s*[:\-]/i.test(definitionText)) formatted += `n. ${definitionText.replace(/^n\s*[:\-]*/i, '')}`; // Check for noun
      else if (/^v\s*[:\-]/i.test(definitionText)) formatted += `v. ${definitionText.replace(/^v\s*[:\-]*/i, '')}`; // Check for verb
      else if (/^adj\s*[:\-]/i.test(definitionText)) formatted += `adj. ${definitionText.replace(/^adj\s*[:\-]*/i, '')}`; // Check for adjective
      else formatted += `– ${definitionText}`; // Default formatting for other types
  
      if (exampleMatch) { // If an example is found, format it
        formatted += `<br><em>Example: "${exampleMatch[1]}"</em>`;
      }
  
      return formatted; // Return the formatted definition
    }).join('<br><br>'); // Join the formatted definitions with line breaks
  
    definitions.innerHTML = `<h3>Definition:</h3><p>${formattedDefs}</p>`; // Set the inner HTML of definitions
  }
  

  // Fetch from Thesaurus API
  const thesRes = await fetch(`https://api.api-ninjas.com/v1/thesaurus?word=${word}`, { // API Key: bvP/UWBSRTwxrfUXfyY/GQ==hE0FVuQMYHIdwgTQ (Same API Key as it is the same website)
    headers: { 'X-Api-Key': 'bvP/UWBSRTwxrfUXfyY/GQ==hE0FVuQMYHIdwgTQ' }
  });
  const thesData = await thesRes.json(); // Parse the response as JSON
  // This is where Thesaurus starts
  if (thesData.synonyms && thesData.synonyms.length) { // Check if synonyms exist
    const synonymsHTML = thesData.synonyms.map(s => `<li>${s}</li>`).join(''); // Map through each synonym and create a list item
    thesaurus.innerHTML += ` 
      <h3>Synonyms:</h3>
      <ul class="list">${synonymsHTML}</ul> 
    `; // Set the inner HTML of thesaurus with synonyms
  }
  if (thesData.antonyms && thesData.antonyms.length) { // Check if antonyms exist
    const antonymsHTML = thesData.antonyms.map(a => `<li>${a}</li>`).join(''); // Map through each antonym and create a list item
    thesaurus.innerHTML += `
      <h3>Antonyms:</h3>
      <ul class="list">${antonymsHTML}</ul>
    `; // Set the inner HTML of thesaurus with antonyms
  }

  // Fetch from Pexels Image API
  const imgRes = await fetch(`https://api.pexels.com/v1/search?query=${word}`, { // API Key: avCIa49f1zE3nPSXiM27CIkx1KZ92SevzZMaIG91s7wDa3MKWJ1OXdgy
    headers: { 'Authorization': 'avCIa49f1zE3nPSXiM27CIkx1KZ92SevzZMaIG91s7wDa3MKWJ1OXdgy' }
  });
  const imgData = await imgRes.json(); // Parse the response as JSON
  if (imgData.photos && imgData.photos.length) { // Check if photos exist
    images.innerHTML = '<h3>Images:</h3>'; // Set the inner HTML of images section
    imgData.photos.slice(0, 3).forEach(photo => { // Iterate through the first 3 photos - Change the number as per your requirement
      const img = document.createElement('img'); // Create a new image element
      img.src = photo.src.small; // Set the source of the image
      images.appendChild(img); // Append the image to the images section
    });
  }
}

// Pronunciation (Text-to-Speech)
pronounceBtn.addEventListener('click', () => { // Event listener for the pronounce button
  const utterance = new SpeechSynthesisUtterance(currentWord); // Create a new SpeechSynthesisUtterance object with the current word
  speechSynthesis.speak(utterance); // Speak the word
});


// Speech to text functionality using inbuilt browser speech recognition
micBtn.addEventListener('click', () => { // Event listener for the microphone button
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) { // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; // Use the appropriate constructor
    const recognition = new SpeechRecognition(); // Create a new instance of SpeechRecognition
    recognition.lang = 'en-US'; // Set the language for recognition
    recognition.start(); // Start recognition

    recognition.onresult = function (event) { // Event handler for when results are available
      const transcript = event.results[0][0].transcript; // Get the transcript of the recognized speech
      wordInput.value = transcript; // Set the input value to the transcript
      fetchWordData(transcript); // Fetch word data for the recognized word
    };

    recognition.onerror = function (event) { // Event handler for errors
      alert('Error occurred in recognition: ' + event.error); // Show an alert with the error message
    };
  } else { // If Speech Recognition is not supported
    alert('Speech Recognition not supported in this browser.');
  }
});

// Speech to Text functionality was supposed to be built using Assembly API with an API key of (d8dcb6ad2ebd4a7991081e4d1da921c8) however, Assembly API features multiple problems with our code and sometimes doesn't fetch the correct word. Assembly API is mostly used for voice recognition and transcription, not voice searching for one word. Hence, to resolve this issue, we have used the inbuilt browser speech recognition API which is more reliable and efficient for our use case.