let currentUser = null;
let booksData = [];
let currentBook = null;
let currentPage = 0;

const screens = {
    login: document.getElementById('login-screen'),
    catalog: document.getElementById('catalog-screen'),
    details: document.getElementById('details-screen'),
    reader: document.getElementById('reader-screen')
};

document.addEventListener('DOMContentLoaded', async () => {
    await loadBooks();
    initializeEventListeners();
    
    const savedUser = localStorage.getItem('libraryUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showScreen('catalog');
        updateUserInfo();
    }
});

async function loadBooks() {
    try {
        const response = await fetch('libros.json');
        const data = await response.json();
        booksData = data.books;
    } catch (error) {
        console.error('Error al cargar los libros:', error);
        booksData = [];
    }
}

function initializeEventListeners() {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    document.getElementById('back-to-catalog').addEventListener('click', () => {
        showScreen('catalog');
    });
    
    document.getElementById('read-book-btn').addEventListener('click', () => {
        openReader();
    });
    
    document.getElementById('close-reader').addEventListener('click', () => {
        showScreen('details');
    });
    
    document.getElementById('prev-page').addEventListener('click', () => {
        changePage(-1);
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        changePage(1);
    });
    
    document.addEventListener('keydown', (e) => {
        if (screens.reader.classList.contains('active')) {
            if (e.key === 'ArrowLeft') {
                changePage(-1);
            } else if (e.key === 'ArrowRight') {
                changePage(1);
            } else if (e.key === 'Escape') {
                showScreen('details');
            }
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('student-name').value;
    const course = document.getElementById('student-course').value;
    const id = document.getElementById('student-id').value;
    
    currentUser = { name, course, id };
    localStorage.setItem('libraryUser', JSON.stringify(currentUser));
    
    showScreen('catalog');
    updateUserInfo();
    renderBooksCatalog();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('libraryUser');
    showScreen('login');
    document.getElementById('login-form').reset();
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('user-name').textContent = currentUser.name;
    }
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
    });
    screens[screenName].classList.add('active');
    
    if (screenName === 'catalog') {
        renderBooksCatalog();
    }
}

function renderBooksCatalog() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';
    
    booksData.forEach(book => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.onclick = () => showBookDetails(book);
        
        card.innerHTML = `
            <img src="${book.cover}" alt="${book.title}" class="book-cover">
            <div class="book-info">
                <div class="book-title">${book.title}</div>
                <div class="book-author">${book.author}</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

function showBookDetails(book) {
    currentBook = book;
    
    document.getElementById('detail-cover').src = book.cover;
    document.getElementById('detail-cover').alt = book.title;
    document.getElementById('detail-title').textContent = book.title;
    document.getElementById('detail-author').textContent = book.author;
    document.getElementById('detail-description').textContent = book.description;
    
    showScreen('details');
}

function openReader() {
    if (!currentBook) return;
    
    currentPage = 0;
    document.getElementById('reader-title').textContent = currentBook.title;
    showScreen('reader');
    renderPage();
}

function renderPage() {
    if (!currentBook || !currentBook.pages) return;
    
    const pageElement = document.getElementById('book-page');
    const pageContent = currentBook.pages[currentPage];
    
    pageElement.textContent = pageContent;
    
    document.getElementById('page-counter').textContent = 
        `Página ${currentPage + 1} de ${currentBook.pages.length}`;
    
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === currentBook.pages.length - 1;
}

function changePage(direction) {
    if (!currentBook || !currentBook.pages) return;
    
    const newPage = currentPage + direction;
    
    if (newPage < 0 || newPage >= currentBook.pages.length) {
        return;
    }
    
    const pageElement = document.getElementById('book-page');
    const animationClass = direction > 0 ? 'flipping-forward' : 'flipping-backward';
    
    pageElement.classList.add(animationClass);
    
    setTimeout(() => {
        currentPage = newPage;
        renderPage();
        pageElement.classList.remove(animationClass);
    }, 300);
}