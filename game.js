document.getElementById('startQuizBtn').addEventListener('click', () => { // Event listener for the start quiz button
    if (!window.dictData || !window.dictData.definition) { // Check if the word data is available
      return; // If not, do nothing
    }

    // Initializing the Game/Quiz Area

    const quizArea = document.getElementById('quizArea'); // Get the quiz area element
    const definitions = document.getElementById('definitions'); // Get the definitions element

    const correctDef = window.dictData.definition.split(/[1-9]\. */).filter(Boolean)[0].trim(); // Extract the correct definition from the word data
    let options = [correctDef, ...fakeOptions].sort(() => Math.random() - 0.5); // Create an array of options including the correct definition and fake options

    document.querySelectorAll('.quiz-option').forEach(btn => { // Get all quiz option buttons
      btn.addEventListener('click', () => { // Add click event to each button
        const userAnswer = btn.textContent; // Get the user's answer from the button text
        const isCorrect = userAnswer === correctDef; // Check if the user's answer is correct
        document.getElementById('quizResult').textContent = isCorrect ? '✅ Correct!' : '❌ Wrong!'; // Display the result
        setTimeout(resetQuiz, 2000); // Reset the quiz after 2 seconds
      });
    });
  });

    // This is where the quiz area is started

const fakeDefinitions = [ // Array of fake definitions for the quiz
  "A small piece of cloth used for decoration.",
  "A type of musical instrument.",
  "An ancient form of transportation.",
  "A rare plant species from the Amazon.",
  "A traditional dish from Eastern Europe."
];

startQuizBtn.addEventListener('click', () => { // Event listener for the start quiz button
  if (!dictData || !dictData.definition) { // Check if the word data is available
    alert("Search a word first!"); // If not, show an alert
    return; // Do nothing
  }

  definitions.classList.add('blurred'); // Add a blurred class to the definitions element
  quizArea.classList.remove('hidden'); // Remove the hidden class from the quiz area

  let matches = dictData.definition.match(/\d+\.\s*[^.]+/g); // Extract definitions from the word data
  const correctDef = matches ? matches[0].replace(/^\d+\.\s*/, '').trim() : dictData.definition.trim();  // Get the first definition as the correct one
  let options = [correctDef]; // Initialize options with the correct definition

  while (options.length < 3) { // Ensure there are at least 3 options - You can change the number as your options here
    const fake = fakeDefinitions[Math.floor(Math.random() * fakeDefinitions.length)]; // Randomly select a fake definition
    if (!options.includes(fake)) options.push(fake); // Add it to the options if it's not already included
  }

  options = options.sort(() => Math.random() - 0.5); // Shuffle the options

  quizArea.innerHTML = `
    <p id="quizQuestion">What is the correct definition of "${currentWord}"?</p>
    ${options.map(opt => `<button class="quiz-option" data-answer="${opt}">${opt}</button><br>`).join('')}
    <p id="quizResult"></p>
  `; // Create the quiz question and options dynamically

  document.querySelectorAll('.quiz-option').forEach(btn => { // Get all quiz option buttons
    btn.addEventListener('click', () => { // Add click event to each button
      const userAnswer = btn.getAttribute('data-answer'); // Get the user's answer from the button data attribute
      const resultText = userAnswer === correctDef ? "✅ Correct!" : "❌ Wrong!"; // Check if the user's answer is correct
      document.getElementById('quizResult').textContent = resultText; // Display the result
      definitions.classList.remove('blurred'); // Remove the blurred class from the definitions element
    });
  });
});