const page = window.location.pathname.split("/").pop();

const id = page.replace("produit", "").replace(".html", "");

let currentProduct = null;
fetch(`https://authenticparfum2-production.up.railway.app/api/products/${id}`)
.then(res => res.json())
.then(product => {

    console.log(product);

    currentProduct = product;


    document.getElementById("product-image").src =
        product.image_url;


    document.getElementById("product-name").textContent =
        product.name;


    document.getElementById("product-price").textContent =
        product.price + " DH";


 if(product.notes_image_url){
    document.getElementById("notes-image").src =
    "./" + product.notes_image_url;
}

})
.catch(error => console.log(error));