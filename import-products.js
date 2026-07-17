require("dotenv").config();

const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const pool = require("./backend/src/config/database");


const files = [
 "frontend/homme-parfum.html",
 "frontend/page2.html",
 "frontend/femme-parfum.html",
 "frontend/p2.html",
 "frontend/catalogue.html"
];


async function importProducts() {

    try {

        let productNumber = 1;


        for (const file of files) {


            const html = fs.readFileSync(
                path.join(__dirname, file),
                "utf8"
            );


            const $ = cheerio.load(html);


            console.log("FILE:", file);
            console.log("PRODUCTS:", $(".product-card").length);


            const cards = $(".product-card").toArray();


            for (const card of cards) {


                const name = $(card)
                    .find("h3")
                    .text()
                    .trim();



                const priceText = $(card)
                    .find(".price")
                    .text()
                    .replace("DH", "")
                    .replace("dh", "")
                    .trim();



                const price = Number(priceText);



                const image = $(card)
                    .find("img")
                    .attr("src");
                

                let notesImage = "";

const productFile = `produit${productNumber}.html`;

const productPath = path.join(__dirname, "frontend", productFile);

console.log("PRODUCT PATH:", productPath);
console.log("EXISTS:", fs.existsSync(productPath));

if (fs.existsSync(productPath)) {

    const productHtml = fs.readFileSync(
        productPath,
        "utf8"
    );

  const products = cheerio.load(productHtml);


if (productNumber <= 28) {
    const index = productNumber + 24;

    notesImage = `catalogue homme Parfums/IMG-20260619-WA${String(index).padStart(4,"0")}.jpg`;

} else {
    const index = productNumber + 2;

    notesImage = `catalogue femme parfums/IMG-20260622-WA${String(index).padStart(4,"0")}.jpg`;
}

console.log("FOUND NOTES:", products(".notes-full").length);
console.log("NOTES SRC:", notesImage);
console.log(
 "NOTE EXISTS:",
 fs.existsSync(
 path.join(__dirname,"frontend",notesImage)
 )
);

}



                const link = `produit${productNumber}.html`;



             console.log("CHECK:", {
                 productNumber,
                 name,
                 price,
                 image,
                 notesImage,
                 link
            });



                if (name && !isNaN(price) && image) {

                console.log("NOTES IMAGE:", notesImage);
                console.log("SAVING NOTES IMAGE:", notesImage);
                console.log("FINAL NOTES:", notesImage);
                    const result = await pool.query(


`
INSERT INTO products
(name, description, price, stock_quantity, image_url, link, notes_image_url)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *
`,
[
 name,
 "Parfum",
 price,
 10,
 image,
 link,
 notesImage
]
);



                    console.log(
                        "INSERT OK:",
                        result.rows[0].link
                    );



                    productNumber++;

                }


            }


        }


        console.log("Import finished");


    } catch(error) {


        console.error(
            "ERROR:",
            error.message
        );


    }


}


importProducts();