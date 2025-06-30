const quoteDisplay = document.getElementById('quoteDisplay');
const newQuote = document.getElementById('newQuote');
const SERVER_URL = "https://mocki.io/v1/2e263aba-45b3-4e5d-8c99-5a2304c31c8b"; // temporary demo endpoint

let quotes = [];

// Load from localStorage if available
const savedQuotes = localStorage.getItem('quotes');
if (savedQuotes) {
  quotes = JSON.parse(savedQuotes);
} else {
  quotes = [
    { text: "The best way to predict the future is to invent it.", category: "inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "life" },
    { text: "Do one thing every day that scares you.", category: "courage" },
  ];
  saveQuotes();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote(filteredQuotes = null) {
  const availableQuotes = filteredQuotes || quotes;
  if (availableQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableQuotes.length);
  const quote = availableQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;

  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small><em>Category: ${quote.category}</em></small>
  `;
}

newQuote.addEventListener('click', () => {
  const selected = localStorage.getItem('selectedCategory') || 'all';
  if (selected === 'all') {
    showRandomQuote();
  } else {
    const filtered = quotes.filter(q => q.category === selected);
    showRandomQuote(filtered);
  }
});

function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.type = 'text';
  textInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    alert("Quote added!");
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert("Please enter both a quote and a category.");
  }
}

function populateCategories() {
  const dropdown = document.getElementById('categoryFilter');
  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    dropdown.appendChild(option);
  });

  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) dropdown.value = savedCategory;
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  if (selectedCategory === 'all') {
    showRandomQuote(quotes);
  } else {
    const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    showRandomQuote(filteredQuotes);
  }
}

function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format!');
      }
    } catch (e) {
      alert('Error reading file: ' + e.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// 🚀 SERVER SYNC FEATURE
async function syncWithServer() {
  try {
    const res = await fetch(SERVER_URL);
    const serverQuotes = await res.json();

    // Basic conflict resolution: server wins
    const updated = JSON.stringify(serverQuotes) !== JSON.stringify(quotes);
    if (updated) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      alert("Quotes synced from server. Your local quotes have been updated.");
    }
  } catch (err) {
    console.error("Server sync failed:", err.message);
  }
}

// ⏲️ Check server every 20 seconds
setInterval(syncWithServer, 20000);

// Initial setup
createAddQuoteForm();
populateCategories();
syncWithServer(); // Initial sync
