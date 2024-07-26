import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const db = new pg.Pool({ connectionString: process.env.DATABASE_CONNECTION });

// I REALLY hope this seed is correct... 
// User table stores user name and password, with a unique ID attached.
// Also stores a join date and has a field for a url
// This url is never used, because I don't know how to upload images to a server yet
// Posts table stores post and corresponding info, like whose post it is, how many likes and when it was posted.
// Has a foreign key!
// Feel free to create your own account on here - DON'T use your real password PLEASE IT'S NOT ENCRYPTED I DON'T KNOW HOW 
db.query(`CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  user_name VARCHAR(20) unique,
  password VARCHAR(100) NOT NULL,
  joinDate BIGINT,
  avatar_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS posts (
  post_id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  postDate BIGINT,
  numLikes INT,
  img_url VARCHAR(255),
  user_name VARCHAR(20)
);

alter table posts
  add column user_id INT references users;

INSERT INTO users (user_name, password, joinDate)
VALUES ('AllLarryNoLurr', 'mycoolpassword123', 0);

INSERT INTO posts (user_id, user_name, content, postDate, numLikes)
VALUES (1, 'AllLarryNoLurr', 'hello chat', 0, '1000000');`);