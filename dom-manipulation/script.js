const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');

// Predefined quote list
const quotes = [
  { text: "The best way to predict the future is to invent it.", category: "inspiration" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "life" },
  { text: "Do one thing every day that scares you.", category: "courage" },
];

// Show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

newQuote.addEventListener('click', showRandomQuote);

// Add new quote via input fields
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    // Add to the array
    quotes.push({ text: newText, category: newCategory });

    // Optional: feedback or immediate display
    alert("Quote added successfully!");

    // Clear the input fields
    textInput.value = '';
    categoryInput.value = '';
  } else {
    alert("Please fill in both the quote and category.");
  }
}
addQuote();