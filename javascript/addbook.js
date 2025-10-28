//Ensure local storage exist
let localbook = JSON.parse(localStorage.getItem("book")) || [];

//Handle Add Books
document.getElementById("addBookBtn").addEventListener("click", function(e) {
    e.preventDefault();

    //Collect Value
    const title = document.getElementById("title").value.trim();
    const autor = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();
    const year = document.getElementById("year").value;
    const description = document.getElementById("description").value.trim();
    const coverInput = document.getElementById("cover")

    //Convert image to based64 so it can be stored
    const file = coverInput.files[0];
    if (!file){
        alert("Please Select a book cover")
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function() {
        const imageBase64 = reader.result;

        //Create new book object
        const newBook ={
            title,
            author: autor,
            category,
            year,
            description,
            image: imageBase64,
            read: false
    };

    //save to localstorage
    localbook.push(newBook);
    localStorage.setItem("book", JSON.stringify(localbook));

    alert("Book added Successfully ✅");

    //Redirect back to home page
    window.location.href = "../index.html";
    };
    
    // convert file to bese64
    reader.readAsDataURL(file);
});

