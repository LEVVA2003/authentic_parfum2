async function loadProducts(){

try {

const response = await fetch("http://localhost:5000/api/products");

const data = await response.json();

products = data
.filter(product => product.name.toLowerCase() !== "test parfum")
.map((product, index) => {

    

return {
    name: product.name,
    price: Number(product.price) || 0,
    image: product.image_url || product.image,
    link: product.link,
    quantity: 1
};

});

console.log(products);
displayProducts(products);

} catch(error){

console.log(error);

}

}