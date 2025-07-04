// Clear search
const clearSearchBtn = document.getElementById('clearSearchBtn');
if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', function() {
        searchBar.value = '';
        renderBooks();
    });
}

// Export user's books
const exportBooksBtn = document.getElementById('exportBooksBtn');
if (exportBooksBtn) {
    exportBooksBtn.addEventListener('click', function() {
        const books = getBooks();
        const blob = new Blob([JSON.stringify(books, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_books.json';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    });
}

// Import books
const importBooksBtn = document.getElementById('importBooksBtn');
const importBooksInput = document.getElementById('importBooksInput');
if (importBooksBtn && importBooksInput) {
    importBooksBtn.addEventListener('click', function() {
        importBooksInput.click();
    });
    importBooksInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const imported = JSON.parse(evt.target.result);
                if (Array.isArray(imported)) {
                    const books = getBooks();
                    let added = 0;
                    imported.forEach(book => {
                        if (book.title && book.author && book.genre && book.year && book.status) {
                            books.push(book);
                            added++;
                        }
                    });
                    saveBooks(books);
                    renderBooks();
                    alert(`${added} books imported!`);
                } else {
                    alert('Invalid file format.');
                }
            } catch {
                alert('Failed to import books.');
            }
        };
        reader.readAsText(file);
        importBooksInput.value = '';
    });
}