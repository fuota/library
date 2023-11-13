let bookForm = document.getElementById("getBook");
let libraryGrid = document.getElementById("libraryGrid");
var count = localStorage.getItem('count') || 1000;
var actualCount = localStorage.getItem('actualCount') || 0;

const h1 = document.getElementById("welcome");


var storedBooksJSON = localStorage.getItem('myLibrary');
var myLibrary = JSON.parse(storedBooksJSON) || [];
console.log("MY LIB: ",myLibrary);

function updateVisibility(count) {
    

    if (count === 0) {
      // Display the h1 element
      h1.style.display = 'block';
    } else {
      // Hide the h1 element
      h1.style.display = 'none';
    }
}
function increaseCount() {
   
    count = parseInt(count, 10) + 1;
    actualCount = parseInt(actualCount, 10) + 1;
    // localStorage.setItem('count', count);
    // console.log('Count increased:', count);
}
function decreaseCount() {
    var count = localStorage.getItem('count') || 0;
    var actualCount = localStorage.getItem('actualCount') || 0;
    count = parseInt(count, 10) - 1;
    actualCount = parseInt(actualCount, 10) - 1;
}   
function Book(title, author,currentPage, totalPages, id) {
    this.title = title;
    this.author = author;
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.id = id;
    if (this.currentPage == this.totalPages) this.read = true;
    else this.read = false;


}

function createModal(card,id){
    modal = document.createElement("div");
    modal.id = "modal" + id;
    modal.classList.add("modal");
    modal.classList.add("fade");

    modal.tabIndex = "-1";
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden","true");
    index = myLibrary.findIndex(book => book.id == id);
    book = myLibrary[index];
    modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h1 class="modal-title fs-5" ">Your book information</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="row g-3 needs-validation" id="getBookModal" data-id="${book.id}">
                    <div class="col-md-12">
                    <label for="newBookTitle" class="form-label">Book Title</label>
                    <input type="text" class="form-control" id="newBookTitle" value = "${book.title}"required>
                    </div>
                    <div class="col-md-12">
                    <label for="newAuthor" class="form-label">Book Author</label>
                    <input type="text" class="form-control" id="newAuthor" value = "${book.author}" required>
                    </div>
                    <div class="col-6">
                    <label for="currentPage" class="form-label">Current Page</label>
                    <input type="number" max="{totalPage.value}" class="form-control" id="currentPage" value="${book.currentPage}" required>
                    </div>
                    <div class="col-6">
                    <label for="totalPage" class="form-label">Total Page</label>
                    <input type="number" class="form-control" id="totalPage" value="${book.totalPages}" required>
                    </div>
                    <div class="col-4">
                        <button class="btn btn-primary" type="submit" data-bs-dismiss="modal">Save</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                    </div>
                
                </form>
            </div>
            <div class="modal-footer">
            </div>
        </div>
    </div>
    `
    card.appendChild(modal);

}
function displayBook(book) {
    let bookDiv = document.createElement("div");
    bookDiv.classList.add("book-item");
    bookDiv.classList.add("card");
    bookDiv.dataset.id = book.id;
    bookDiv.innerHTML = `
    <div class="card-body" data-id="${book.id}">
        <h5 class="title card-title">${book.title}</h5>
        <p class="author card-text">${book.author}</p>
        <p class="card-text">You are on page <span class="currentPage">${book.currentPage}</span> / <span class="totalPages">${book.totalPages}</span></p>
        <button class="btn btn-primary status" data-id= "${book.id}" ></button>
        <button class="btn btn-primary edit" data-bs-toggle="modal" data-bs-target="" >Edit<svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg></button>
        <button class="btn btn-danger delete" data-id="${book.id}">Remove</button>
    </div>
    `;

    let cardBody = bookDiv.querySelector(".card-body");
    let status = cardBody.querySelector(".status");
    createModal(cardBody,book.id);
    if (book.read) {
        status.innerHTML = "Read";
    }
    else {
        status.innerHTML = "In Progress";
    }
    const editButton = bookDiv.querySelector(".edit");
    editButton.dataset.bsTarget = "#modal" + book.id;
    libraryGrid.appendChild(bookDiv);
    // actualCount += 1;
    updateVisibility(actualCount);
  
}
function editBookDisplay(book,bookDiv){
    let title = bookDiv.querySelector(".title");
    let author = bookDiv.querySelector(".author");
    let currentPage = bookDiv.querySelector(".currentPage");
    let totalPages = bookDiv.querySelector(".totalPages");
    title.innerHTML = book.title;
    author.innerHTML = book.author;
    currentPage.innerHTML = book.currentPage;
    totalPages.innerHTML = book.totalPages;
    let status = bookDiv.querySelector(".status");
    if (book.read) {
        status.innerHTML = "Read";
    }
    else {
        status.innerHTML = "In Progress";
    }

}
function modifyBookLibrary(id, title, author, currentPage, totalPages) {
    const index = myLibrary.findIndex(book => book.id == id);
    if (index !== -1) {
        myLibrary[index].title = title;
        myLibrary[index].author = author;
        myLibrary[index].currentPage = currentPage;
        myLibrary[index].totalPages = totalPages;
    }
    const bookDiv = document.querySelector('.book-item[data-id="' + id + '"]');
    if (bookDiv) {
        editBookDisplay(myLibrary[index],bookDiv);
    }
    localStorageSave();
}

function deleteBook(id) {
    const index = myLibrary.findIndex(book => book.id == id);
    if (index !== -1) {
        // Remove the book from myLibrary
        myLibrary.splice(index, 1);

        // Remove the corresponding book card from the DOM
        const bookDiv = document.querySelector('.book-item[data-id="' + id + '"]');
        if (bookDiv) {
            bookDiv.remove();
        }
    }
    actualCount -= 1;
    updateVisibility(actualCount);
    localStorageSave();
}
function toggleStatus(id){
    const index = myLibrary.findIndex(book => book.id == id);
    if (index !== -1) {
        myLibrary[index].read = !myLibrary[index].read;
    }
    const bookDiv = document.querySelector('.book-item[data-id="' + id + '"]');
    if (bookDiv) {
        const status = bookDiv.querySelector(".status");
        if (myLibrary[index].read) {
            status.innerHTML = "Read";
        }
        else {
            status.innerHTML = "In Progress";
        }
    }

}
function buildBookDiv(book){
    displayBook(book);
    // bookModal = new bootstrap.Modal(document.getElementById('addModal'));
    // bookModal.hide();
    const bookDiv = document.querySelector('.book-item[data-id="' + book.id + '"]');
    const deleteButton = bookDiv.querySelector(".delete");
    deleteButton.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        console.log(e.target.dataset);
        deleteBook(id);

        
    });

    const statusButton = bookDiv.querySelector(".status");
    statusButton.addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        toggleStatus(id);
    });
    const editButton = bookDiv.querySelector(".edit");
    editButton.addEventListener("click", (e) => {
        console.log(editButton);
        
    });
    console.log(bookDiv);
    let editForm = bookDiv.querySelector('form');
    console.log(editForm);
    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log(1)
        let title = editForm.querySelector("#newBookTitle").value;
        let author = editForm.querySelector("#newAuthor").value;
        let currentPage = editForm.querySelector("#currentPage").value;
        let totalPages = editForm.querySelector("#totalPage").value;
        let id = editForm.dataset.id;
        modifyBookLibrary(id, title, author, currentPage, totalPages);
        
        
    });

}
function clearBooksData() {
    localStorage.removeItem('myLibrary');
    localStorage.removeItem('count');
    localStorage.removeItem('actualCount');
    console.log('Books data cleared!');
}
function localStorageSave(){
    var booksJSON = JSON.stringify(myLibrary);
    localStorage.setItem('myLibrary', booksJSON);
    localStorage.setItem('count', count);
    localStorage.setItem('actualCount', actualCount);

}
myLibrary.forEach(book => {
    buildBookDiv(book);
});
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let title = document.getElementById("newBookTitle").value;
    let author = document.getElementById("newAuthor").value;
    let currentPage = document.getElementById("currentPage").value;
    let totalPages = document.getElementById("totalPage").value;
    increaseCount();
    let book = new Book(title, author, currentPage, totalPages, count);
    myLibrary.push(book);
    console.log(myLibrary);
    localStorageSave();
    buildBookDiv(book);
   
});








