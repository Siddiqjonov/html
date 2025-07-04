// JavaScript for Personal Library Manager
const bookForm = document.getElementById('bookForm');
const booksList = document.getElementById('booksList');
const searchBar = document.getElementById('searchBar');
const filterStatus = document.getElementById('filterStatus');

function getBooks() {
    return JSON.parse(localStorage.getItem('books') || '[]');
}

function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

function renderBooks() {
    const books = getBooks();
    const search = searchBar.value.trim().toLowerCase();
    const status = filterStatus.value;
    booksList.innerHTML = '';
    let filtered = books.filter(book => {
        const matchesTitle = book.title.toLowerCase().includes(search);
        const matchesStatus = !status || book.status === status;
        return matchesTitle && matchesStatus;
    });
    if (filtered.length === 0) {
        booksList.innerHTML = '<div class="col-12 text-center text-muted">No books found.</div>';
        return;
    }
    filtered.forEach((book, idx) => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
        <div class="card shadow-sm ${book.status === 'Read' ? 'status-read' : 'status-unread'}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h5 class="card-title mb-0"><i class="bi bi-book-half me-2"></i>${book.title}</h5>
                    <div>
                        <button class="btn btn-sm btn-outline-secondary me-1" title="Toggle Read/Unread" onclick="toggleStatus(${idx})">
                            <i class="bi ${book.status === 'Read' ? 'bi-bookmark-check-fill text-success' : 'bi-bookmark-x-fill text-danger'}"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" title="Delete Book" onclick="deleteBook(${idx})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <h6 class="card-subtitle mb-2 text-muted"><i class="bi bi-person"></i> ${book.author} <span class="ms-2"><i class="bi bi-calendar"></i> ${book.year}</span></h6>
                <p class="card-text mb-1"><i class="bi bi-tags"></i> <span class="badge bg-info text-dark">${book.genre}</span></p>
                <p class="card-text"><strong>Status:</strong> <span class="badge ${book.status === 'Read' ? 'bg-success' : 'bg-danger'}">${book.status}</span></p>
            </div>
        </div>`;
        booksList.appendChild(card);
    });
}

bookForm.onsubmit = function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const genre = document.getElementById('genre').value.trim();
    const year = document.getElementById('year').value.trim();
    const status = document.getElementById('status').value;
    if (!title || !author || !genre || !year) return;
    const books = getBooks();
    books.push({ title, author, genre, year, status });
    saveBooks(books);
    bookForm.reset();
    renderBooks();
};

window.deleteBook = function(idx) {
    const books = getBooks();
    books.splice(idx, 1);
    saveBooks(books);
    renderBooks();
};

window.toggleStatus = function(idx) {
    const books = getBooks();
    books[idx].status = books[idx].status === 'Read' ? 'Unread' : 'Read';
    saveBooks(books);
    renderBooks();
};

searchBar.addEventListener('input', renderBooks);
filterStatus.addEventListener('change', renderBooks);

document.addEventListener('DOMContentLoaded', renderBooks);
