const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const dinnerOrder = mongoose.model("dinnerorder", mongoose.Schema({
    table: Number,
    foodorder: String,
    foodcookingtime: Number,
    drinks: String,
}));

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/dinnerorders", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const dinnerOrders = await dinnerOrder.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await dinnerOrder.countDocuments();

        res.json({
            dinnerOrders,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


async function run() {
    await mongoose.connect("mongodb://localhost:27017/test");
    
    try {
        const dinner = await dinnerOrder.find();
        
        if (!dinner.length) {
            await dinnerOrder.create([
                { table: 1, foodorder: "pizza", foodcookingtime: 20, drinks: "wine" },
                { table: 2, foodorder: "pasta", foodcookingtime: 15, drinks: "water" },
                { table: 3, foodorder: "burger", foodcookingtime: 10, drinks: "juice" },
                { table: 4, foodorder: "steak", foodcookingtime: 25, drinks: "beer" },
                { table: 5, foodorder: "salad", foodcookingtime: 5, drinks: "wine" },
                { table: 6, foodorder: "soup", foodcookingtime: 7, drinks: "wine" },
                { table: 7, foodorder: "sandwich", foodcookingtime: 3, drinks: "coffee" },
                { table: 8, foodorder: "steak", foodcookingtime: 25, drinks: "tea" },
                { table: 9, foodorder: "sushi", foodcookingtime: 12, drinks: "lemonade" },
                { table: 10, foodorder: "chicken", foodcookingtime: 18, drinks: "beer" },
            ]);
        }
        
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
        
    } catch (error) {
        console.error(error.message);
    } finally {
        mongoose.disconnect();
    }
}

run();