import express, { response } from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();

app.use(express.json());
dotenv.config();
app.use(cors());


// I meant to make this its own api but it's here instead...
// Functionally, not that different, but still.
const asciimoji = [
    {name:"acid", display:"⊂(◉‿◉)つ"},
    {name:"bearflip", display:"ʕノ•ᴥ•ʔノ ︵ ┻━┻"},
    {name:"claro", display:"(͡ ° ͜ʖ ͡ °)"},
    {name:"cute", display:"(｡◕‿‿◕｡)"},
    {name:"donger", display:"ヽ༼ຈل͜ຈ༽ﾉ"},
    {name:"dontwant", display:"ヽ(｀Д´)ﾉ"},
    {name:"gimme", display:"༼ つ ◕_◕ ༽つ"},
    {name:"lenny", display:"( ͡° ͜ʖ ͡°)"},
    {name:"nerd", display:"(⌐⊙_⊙)"},
    {name:"omg", display:"◕_◕"},
    {name:"shrug", display:"¯\_(ツ)_/¯"},
    {name:"tears", display:"(ಥ﹏ಥ)"},
    {name:"zombie", display:"[¬º-°]¬"},
    {name:"none", display:""},
]

// Get database
const db = new pg.Pool({
    connectionString: process.env.DATABASE_CONNECTION,
});

// Root
app.get("/", function(request,response){
    response.send("This is the root route.");
});

// Not api api for getting a random asciimoji in the actual app
app.get("/asciimoji", async function (request, response) {
    response.json(asciimoji);
});

// Get all posts from the database
app.get("/posts", async function (request, response) {
    const result = await db.query("SELECT * FROM posts");
    const posts = result.rows;
    response.json(posts);
});

// Get all the users from the database
app.get("/users", async function (request, response) {
    const result = await db.query("SELECT * FROM users");
    const users = result.rows;
    response.json(users);
});

// Query to find specific user by id
app.post("/userquery", async function (request,response){
    console.log("request.body", request.body.id);
    const result = await db.query(`SELECT * FROM users WHERE user_id='${request.body.id}'`);
    response.json(result.rows);
});

// This doesn't do anything.
app.post("/posts", async function (request,response){
    console.log("request.body", request.body);
    response.json({status:"Message Recieved"});
});

// Insert new user data into user table
app.post("/signup", function(request,response){
    console.log("request.body", request.body);
    db.query(`INSERT INTO users (user_name, password, joindate)
              VALUES ('${request.body.username}', '${request.body.password}', ${Date.now()});`);
    response.json({status:"Message Recieved"});
});

// Log in to a specific user account
// I do the password/username logic in the script js; should I have done a query here instead?
app.post("/login", async function(request,response){
    console.log("request.body", request.body.username);
    const result = await db.query(`SELECT * FROM users WHERE user_name='${request.body.username}'`);
    response.json(result.rows);
});

// Add new post to database
app.post("/newpost", function(request,response){
    console.log("request.body", request.body);
    console.log(Date.now());
    db.query(`INSERT INTO posts (user_id, user_name, content, postDate, numLikes)
              VALUES (${request.body.userId}, '${request.body.userName}', '${request.body.message}', ${Date.now()}, 0);`);
    response.json({status:"Message Recieved"});
});

// Add a like to requested database
app.post("/likepost", function(request,response){
    console.log("request.body", request.body);
    db.query(`UPDATE posts
              SET numlikes = ${request.body.numLikes}
              WHERE post_id = ${request.body.postId}`);
    response.json({status:"Message Recieved"});
});

// Port 8080
app.listen(8080,() => {
    console.log("Running on port 8080");
});