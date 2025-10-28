// ===== preview panel =====
const previewPanel = document.querySelector(".preview-panel");
let showAll = false; // default to showing limited books
const booksPerRow = 4;

// ===== sample books =====
const book = [
  {
    title: "Candide",
    author: "by Voltaire, William Fleming, Philip Littell, and Jack Davenport",
    image: "image/Candide.jpg",
    year: 1759,
    read: false,
    description: "Originally published in 1759, Candide is a satirical novella...",
    category: "Adventure"
  },
  {
    title: "Resurrection",
    author: "by Tolstoy, Leo, graf",
    image: "image/Resurrection.jpg",
    year: 1899,
    read: false,
    description: "Published in 1899, Resurrection is Tolstoy’s last major novel...",
    category: "Drama"
  },
  {
    title: "The Brothers Karamazov",
    author: "by Фёдор Михайлович Достоевский",
    image: "image/The Brothers Karamazov.jpg",
    year: 1880,
    read: false,
    description: "Published in 1880, The Brothers Karamazov is Dostoevsky’s masterpiece...",
    category: "Philosophical"
  },
  // ... (your other books here)
];

// ===== store default only once =====
if (!localStorage.getItem("book")) {
  localStorage.setItem("book", JSON.stringify(book));
}

// ===== get stored data =====
let localbook = JSON.parse(localStorage.getItem("book")) || [];

// ===== persist UI state =====
function saveUIState() {
  localStorage.setItem("uiState", JSON.stringify({
    showAll,
    currentCategoryFilter
  }));
}

function loadUIState() {
  const saved = JSON.parse(localStorage.getItem("uiState"));
  if (saved) {
    showAll = saved.showAll ?? false;
    currentCategoryFilter = saved.currentCategoryFilter || "all";
  }
}

// ===== find container =====
const downmiddle = document.querySelector(".downmiddle");

// ===== render function =====
function renderBooks() {
  localbook = JSON.parse(localStorage.getItem("book")) || [];

  // Decide how many books to show
  const booksToShow = showAll ? localbook : localbook.slice(0, booksPerRow);

  // Add the header and with toggle button
  let headerSection = `
    <div class="section-header">
      <h2>Recommended</h2>
      <button id="see-more-books">${showAll ? "See Less" : "See More"} </button>
    </div>
  `;

  downmiddle.innerHTML = booksToShow.map((b, i) => {
    return `
    <div class="candide" onclick="showPreview(${i})">
        <img src="${b.image}" alt="Book Cover">
        <div class="candide-text">
            <h2 class="title">${b.title}</h2>
            <p class="author">${b.author}</p>
            <p>Status: <strong id="status-${i}">${b.read ? "✅ Read" : "❌ Not Read"}</strong></p>
            <div class="status">
              <button class="mark-as-read" id="read-btn-${i}" onclick="toggleRead(${i}); event.stopPropagation();">
                ${b.read ? "Mark as Not Read" : "Mark as Read"}
              </button>
            </div>
            <div class="btn"> 
              <button class="delete" onclick="deleteBook(${i}); event.stopPropagation();">Delete</button>
              <button class="editbtn" onclick="editBook(${i}); event.stopPropagation();">Edit</button>
            </div>
        </div>
    </div>
    `;
  }).join("");

  // Combine and inject into .downmiddle
  downmiddle.innerHTML = headerSection + downmiddle.innerHTML;

  // Attach listener for toggle button
  document.getElementById("see-more-books").addEventListener("click", () => {
    showAll = !showAll; // flip between true/false
    saveUIState();      // persist
    renderBooks();      // re-render
  });
}

// ===== toggle read =====
window.toggleRead = function(index) {
  localbook[index].read = !localbook[index].read;
  localStorage.setItem("book", JSON.stringify(localbook));

  renderBooks();

  // Re-render category section based on current filter
  if (currentCategoryFilter === "all") {
    renderCategoryBooksFirstFour();
  } else {
    renderCategoryBooks(currentCategoryFilter);
  }
};

// ===== preview Function =====
window.showPreview = function(index) {
  const book = localbook[index];
  previewPanel.innerHTML = `
    <img src="${book.image}" alt="Book Cover">
    <h2 class="title">${book.title}</h2>
    <p class="author">${book.author}</p>
    <p class="year">📅 ${book.year}</p>
    <p class="description">${book.description}</p>
    <button class="read">Read Now</button>
  `;
  previewPanel.style.display = "block";
};

// ===== Category Section =====
const categoryBookContainer = document.querySelector(".categoryBooks");

let currentCategoryFilter = "all"; // Default to show all categories

// Function to render category books based on selected category
function renderCategoryBooks(filter = "all") {
  categoryBookContainer.innerHTML = "";

  let filteredBooks = 
    filter === "all" 
      ? localbook 
      : localbook.filter(book => book.category === filter);

  filteredBooks.forEach(book => {
    const index = localbook.indexOf(book);
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("onclick", `showPreview(${index})`);
    bookCard.innerHTML = `
      <img src="${book.image}" alt="Book Cover">
      <h3 class="title">${book.title}</h3>
      <p class="author">${book.author}</p>
      <p>Status: <strong id="status-${index}">${book.read ? "✅ Read" : "❌ Not Read"}</strong></p>
      <button class="readbtn" onclick="toggleRead(${index}); event.stopPropagation();">
        ${book.read ? "Mark as Not Read" : "Mark as Read"}
      </button>
      <div class="catbtn">
        <button class="deletebtn" onclick="deleteBook(${index}); event.stopPropagation();">Delete</button>
        <button class="editbtn" onclick="editBook(${index}); event.stopPropagation();">Edit</button>
      </div>
    `;
    categoryBookContainer.appendChild(bookCard);
  });
}

document.querySelectorAll(".categoryButton").forEach(
  btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.category;
      currentCategoryFilter = category;
      saveUIState(); // persist
      renderCategoryBooks(currentCategoryFilter);
    });
  }
);

function renderCategoryBooksFirstFour() {
  categoryBookContainer.innerHTML = "";

  const uniqueCategories = [];
  localbook.forEach(book => {
    if (!uniqueCategories.includes(book.category) && uniqueCategories.length < 4) {
      uniqueCategories.push(book.category);
    }
  });

  const booksToShow = uniqueCategories.map(cat =>
    localbook.find(book => book.category === cat)
  );

  booksToShow.forEach(book => {
    const index = localbook.indexOf(book);
    const bookCard = document.createElement("div");
    bookCard.classList.add("book-card");
    bookCard.setAttribute("onclick", `showPreview(${index})`);
    bookCard.innerHTML = `
      <img src="${book.image}" alt="Book Cover">
      <h3 class="title">${book.title}</h3>
      <p class="author">${book.author}</p>
      <p>Status: <strong id="status-${index}">${book.read ? "✅ Read" : "❌ Not Read"}</strong></p>
      <button class="readbtn" onclick="toggleRead(${index}); event.stopPropagation();">
        ${book.read ? "Mark as Not Read" : "Mark as Read"} 
      </button>
      <div class="catbtn">
        <button class="deletebtn" onclick="deleteBook(${index}); event.stopPropagation();">Delete</button>
        <button class="editbtn" onclick="editBook(${index}); event.stopPropagation();">Edit</button>
      </div>
    `;  
    categoryBookContainer.appendChild(bookCard);
  });
}

// ===== Delete function =====
window.deleteBook = function(index) {
  if (window.confirm("Are you sure you want to delete this book?")){
    localbook.splice(index, 1);
    localStorage.setItem("book", JSON.stringify(localbook));
    renderBooks();

    if(currentCategoryFilter === "all") {
      renderCategoryBooksFirstFour();
    } else{
      renderCategoryBooks(currentCategoryFilter);
    }
  }
};

// ===== Edit function =====
window.editBook = function(index) {
  const book = localbook[index];
  const newTitle = prompt("Edit Title:", book.title);
  const newAuthor = prompt("Edit Author:", book.author);
  const newImage = prompt("Edit Image URL:", book.image);
  const newYear = prompt("Edit Year:", book.year);
  const newDescription = prompt("Edit Description:", book.description);
  const newCategory = prompt("Edit Category:", book.category);
  if (newTitle && newAuthor && newImage && newYear && newDescription && newCategory) {
    book.title = newTitle;
    book.author = newAuthor;
    book.image = newImage;
    book.year = parseInt(newYear);
    book.description = newDescription;
    book.category = newCategory;
    localStorage.setItem("book", JSON.stringify(localbook));
    renderBooks();
    if (currentCategoryFilter === "all") {
      renderCategoryBooksFirstFour();
    } else {
      renderCategoryBooks(currentCategoryFilter);
    }
  }
};

// ===== Search Function =====
const searchInput = document.getElementById("search");
const clearBtn = document.getElementById("clearBtn");
const recommendationSection = document.getElementById("recommendation");
const categoriesSection = document.getElementById("categories");

searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  
  if (value === "") {
    recommendationSection.style.display = "block";
    categoriesSection.style.display = "block";

    renderBooks();
    renderCategoryBooksFirstFour();

    clearBtn.style.display = "none";
    return;
  }

  clearBtn.style.display = "inline-block";
  categoriesSection.style.display = "none";

  const filteredBooks = localbook.filter(book =>
    book.title.toLowerCase().includes(value) ||
    book.author.toLowerCase().includes(value) ||
    book.category.toLowerCase().includes(value)
  );

  const header = `<div class="section-header"><h2>Search results</h2></div>`;

  downmiddle.innerHTML = header + 
    (filteredBooks.length
      ? filteredBooks.map((book, index) => {
        const idx = localbook.indexOf(book);
        return `
          <div class="candide" onclick="showPreview(${idx})">
              <img src="${book.image}" alt="Book Cover">
              <h3 class="title">${book.title}</h3>
              <p class="author">${book.author}</p>
              <p>Status: <strong id="status-${idx}">${book.read ? "✅ Read" : "❌ Not Read"}</strong></p>
              <button class="readbtn" onclick="toggleRead(${idx}); event.stopPropagation();">
                ${book.read ? "Mark as Not Read" : "Mark as Read"}
              </button>
              <div class="catbtn">
                <button class="deletebtn" onclick="deleteBook(${idx}); event.stopPropagation();">Delete</button>
                <button class="editbtn" onclick="editBook(${idx}); event.stopPropagation();">Edit</button>
              </div>
          </div>`;
      }).join("")
      : `<p class="no-results">No results found...</p>`);

  recommendationSection.style.display = "block"; //  force styling
});


clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.style.display = "none";

  recommendationSection.style.display = "block";
  categoriesSection.style.display = "block";

  renderBooks();
  renderCategoryBooksFirstFour();
});

// ===== Initial Load =====
loadUIState();
renderBooks();
if (currentCategoryFilter === "all") {
  renderCategoryBooksFirstFour();
} else {
  renderCategoryBooks(currentCategoryFilter);
}
