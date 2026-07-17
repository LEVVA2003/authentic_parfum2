console.log("APP STARTED");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/database');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running'
  });
});

app.get('/api/products', async (req, res) => {
  try {
 const result = await pool.query(`
SELECT id, name, image_url, link, price
FROM products
ORDER BY id ASC
`);
    res.json(result.rows);
  } catch (error) {
    console.error("DATABASE ERROR:", error.message);

    res.status(500).json({
        message: error.message
    });
}
});
app.get('/api/products/:id', async (req,res)=>{
  try {

    const productNumber = req.params.id;
    console.log("ID RECEIVED:", productNumber);

    const result = await pool.query(
      `
      SELECT * FROM products
      WHERE link = $1
      `,
      [`produit${productNumber}.html`]
    );
    console.log("QUERY RESULT:", result.rows);


    if(result.rows.length === 0){
      return res.status(404).json({
        message:"Product not found"
      });
    }

    res.json(result.rows[0]);

  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
});
const path = require("path");

app.use(express.static(path.join(__dirname, "../../frontend")));
app.get("/api/products/page/:page", async (req, res) => {

    try {

        const page = req.params.page;

        const result = await pool.query(
            "SELECT * FROM products WHERE link = $1",
            [page]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(result.rows[0]);

    } catch(error) {

        console.log(error);

        res.status(500).json({
            error: error.message
        });
    }

});
app.post('/api/orders', async (req,res)=>{
  try {

    const {name, phone, address, city, cart} = req.body;

    const result = await pool.query(
      `
      INSERT INTO orders
      (name, phone, address, city, cart, total)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
      `,
      [
        name,
        phone,
        address,
        city,
        JSON.stringify(cart),
        cart.reduce((sum,item)=> sum + item.price * item.quantity,0)
      ]
    );

    console.log("Saved order:", result.rows[0]);

    res.json({
      success:true,
      message:"Order saved",
      order:result.rows[0]
    });

  } catch(error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:error.message
    });

  }
});
app.get("/api/orders", async (req,res)=>{
    app.get("/api/orders/:id", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM orders WHERE id=$1",
[req.params.id]
);

res.json(result.rows[0]);

}catch(error){

res.status(500).json({
message:error.message
});

}

});
  try {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    res.json(result.rows);

  } catch(error){
    console.log(error);

    res.status(500).json({
      error: error.message
    });
  }
});
app.get("/api/orders/:id", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM orders WHERE id=$1",
[req.params.id]
);

if(result.rows.length === 0){
return res.status(404).json({
message:"Order not found"
});
}

res.json(result.rows[0]);

}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

});
// Update order status
app.put("/api/orders/:id/status", async (req,res)=>{
    try {
        const { status } = req.body;

        const result = await pool.query(
            "UPDATE orders SET status=$1 WHERE id=$2 RETURNING *",
            [status, req.params.id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message:"Order not found"
            });
        }

        res.json({
            success:true,
            order: result.rows[0]
        });

    } catch(error){
        console.log(error);

        res.status(500).json({
            message:error.message
        });
    }
});
// Delete order
app.delete("/api/orders/:id", async (req,res)=>{
    try{

        const result = await pool.query(
            "DELETE FROM orders WHERE id=$1 RETURNING *",
            [req.params.id]
        );

        if(result.rows.length === 0){
            return res.status(404).json({
                message:"Order not found"
            });
        }

        res.json({
            success:true,
            message:"Order deleted",
            order:result.rows[0]
        });

    }catch(error){
        console.log(error);

        res.status(500).json({
            message:error.message
        });
    }
});
module.exports = app;
console.log("APP FINISHED");
