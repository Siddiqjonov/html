// Simple in-memory user and book storage using localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getBooks() {
    return JSON.parse(localStorage.getItem('books') || '[]');
}
function setBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}
function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}
function getCurrentUser() {
    return localStorage.getItem('currentUser');
}
function signOut() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Sign Up logic
if (document.getElementById('signUpForm')) {
    document.getElementById('signUpForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.getElementById('signUpFullName').value.trim();
        const email = document.getElementById('signUpEmail').value.trim();
        const username = document.getElementById('signUpUsername').value.trim();
        const password = document.getElementById('signUpPassword').value;
        const passwordConfirm = document.getElementById('signUpPasswordConfirm').value;
        const users = getUsers();
        const exists = users.some(u => u.username === username || u.email === email);
        const errorDiv = document.getElementById('signUpError');
        const successDiv = document.getElementById('signUpSuccess');
        errorDiv.textContent = '';
        successDiv.textContent = '';
        // Validation
        if (!fullName || !email || !username || !password || !passwordConfirm) {
            errorDiv.textContent = 'Please fill in all fields.';
            return;
        }
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            errorDiv.textContent = 'Please enter a valid email address.';
            return;
        }
        if (password.length < 6) {
            errorDiv.textContent = 'Password must be at least 6 characters.';
            return;
        }
        if (password !== passwordConfirm) {
            errorDiv.textContent = 'Passwords do not match.';
            return;
        }
        if (exists) {
            errorDiv.textContent = 'Username or email already exists.';
            return;
        }
        users.push({ fullName, email, username, password });
        setUsers(users);
        successDiv.textContent = 'Sign up successful! You can now sign in.';
        document.getElementById('signUpForm').reset();
    });
}

// Sign In logic
if (document.getElementById('signInForm')) {
    document.getElementById('signInForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('signInUsername').value.trim();
        const password = document.getElementById('signInPassword').value;
        const users = getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        const errorDiv = document.getElementById('signInError');
        errorDiv.textContent = '';
        if (!user) {
            errorDiv.textContent = 'Invalid username or password.';
            return;
        }
        setCurrentUser(username);
        window.location.href = 'index.html';
    });
}

// Library logic (index.html)
if (document.getElementById('library-section')) {
    const currentUser = getCurrentUser();
    const librarySection = document.getElementById('library-section');
    const welcomeDiv = document.getElementById('welcome');
    if (currentUser) {
        librarySection.style.display = '';
        welcomeDiv.style.display = 'none';
        renderBooks();
        // Add sign out button
        if (!document.getElementById('signOutBtn')) {
            const nav = document.querySelector('nav');
            const btn = document.createElement('button');
            btn.textContent = 'Sign Out';
            btn.id = 'signOutBtn';
            btn.style.marginLeft = '2rem';
            btn.style.background = '#d32f2f';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.borderRadius = '4px';
            btn.style.padding = '0.5rem 1rem';
            btn.style.cursor = 'pointer';
            btn.onclick = signOut;
            nav.appendChild(btn);
        }
    } else {
        librarySection.style.display = 'none';
        welcomeDiv.style.display = '';
    }
    // Add book
    document.getElementById('addBookForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        if (!title || !author) return;
        const books = getBooks();
        books.push({ title, author, user: currentUser });
        setBooks(books);
        renderBooks();
        document.getElementById('addBookForm').reset();
    });
    // Render books
    function renderBooks() {
        const books = getBooks().filter(b => b.user === currentUser);
        const list = document.getElementById('bookList');
        list.innerHTML = '';
        if (books.length === 0) {
            list.innerHTML = '<li>No books added yet.</li>';
        } else {
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = `${book.title} by ${book.author}`;
                list.appendChild(li);
            });
        }
    }
}