const form = document.querySelector("#messageForm");
const input = document.getElementById("messageInput");
const charCounter = document.getElementById("charcount");
const container = document.getElementById('app');
const user = document.getElementById('user');
const showLoginBtn = document.getElementById('login');
const showSignupBtn = document.getElementById('signup');
const asciimoji = document.getElementById('asciimoji');
const loginPopup = document.getElementById('loginPopup');
const loginForm = document.getElementById('loginForm');
const signupPopup = document.getElementById('signupPopup');
const signupForm = document.getElementById('signupForm');

let begUserNotToPutRealPasswordFired = false;
let postsObj;
let userObj = null;
let charCountVar = 500;
input.value = "";
charCounter.textContent = 500 - [...input.value].length;

// Get posts. Posts are also stored in a local object, but
// this is never actually made use of.
async function fetchPosts(){
    const result = await fetch("https://techeducatorsweek4-1.onrender.com/posts");
    const posts = await result.json();
    setPosts(posts);
    generatePosts(postsObj);
}

fetchPosts();

function setPosts(json){
    postsObj = json;
}

// I googled a little to get this right. By the way, it doesn't seem to return the ACTUAL time because of Daylight Savings stuff on my PC.
// Does it work on your PC? I hope so ;~;
function returnReadableDate(rawTime){
    let date = new Date(rawTime-(new Date()).getTimezoneOffset() * 60000);
    let formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    return formattedDate;
}

// Adds a like to a post. You can like a post as much as you want because I don't really know the best way to set up likes.
// Do you dynamically create new tables for liked posts? That seems right, but I don't want to play with fire here haha
async function likeButton(postId, numLikes){
    await fetch("https://techeducatorsweek4-1.onrender.com/likepost", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({postId, numLikes}),
    });

    return;
}

// Longwinded dynamic element creation for posts.
// I hope I learn a better way to structure this soon - I don't like how it reads.
function addPost(post){
    const content = document.createElement('p');
    const div = document.createElement('div');
    const user = document.createElement('p');
    const likes = document.createElement('p');
    const date = document.createElement('p');
    const mfLikeButton = document.createElement('button');
    content.textContent = post.content;

    //This is to allow "'" character to exist. SQL normally doesn't enforce "'" as its only string declaration quote, but Supabase does(?)
    content.textContent = content.textContent.replaceAll("\\27", "'");

    user.textContent = post.user_name;

    likes.textContent = `Likes: ${post.numlikes}`;
    date.textContent = returnReadableDate(post.postdate);

    mfLikeButton.textContent = "LIKE";

    // This isn't very pretty, let's go line by line.
    mfLikeButton.onclick = function (){

        // Gets the parent post <div>, and then DOM selects by class likes to get its respective like total
        let newLikes = this.parentElement.getElementsByClassName("likes")[0];

        // Removes the part that isn't a number.
        newLikes.textContent = newLikes.textContent.replaceAll("Likes: ", "");

        // Make a new variable equal to the number of likes + 1
        let newNumLikes = parseInt(newLikes.textContent) + 1;

        // Update the like count officially
        newLikes.textContent = `Likes: ${newNumLikes}`;

        // Finally, feeds the new like total to a http request
        likeButton(post.post_id, newNumLikes);
    };

    user.classList.add("user");
    content.classList.add("content");
    div.classList.add("post");
    likes.classList.add("likes");
    mfLikeButton.classList.add("mfLikeButton");
    date.classList.add("date");

    div.appendChild(user);
    div.appendChild(date);
    div.appendChild(content);
    div.appendChild(likes);
    div.appendChild(mfLikeButton);
    container.appendChild(div);
}

// Calls the dynamic post creation function once per post. If we had a billion posts something bad would definitely happen,
// so this is obviously not a permanent solution.
async function generatePosts(postArray) {
    // Sort function is not my own, but it works. 
    // Sorts based on highest date number.
    postArray.sort(function(a,b){
        return b.postdate - a.postdate;
    });
    for (let i = 0; i < postArray.length; i++) {
        addPost(postArray[i]);
    }
}

// Instead of re-requesting all the info we already have, just throw in a new pretend post that looks like the new one. If you try to like it, you'll see the issue.
function pretendNewPostIsThere(post){
    let olderInnher = container.innerHTML;
    container.innerHTML = '';
    addPost(post);
    container.innerHTML += olderInnher;
}

// Validates sign up page info.
// Intended to stop multiple users with the same name, and gets you to confirm your password
function validateNewUser(listOfUsernames, username, password, confPassword){
    if(listOfUsernames.length != 0){
        alert("This user already exists.");
        return false;
    }
    if(password != confPassword){
        alert("Passwords don't match.");
        return false;
    }
    else{
        alert("Please check your e-mail to validate your new acc- JUST KIDDING HAHA IDK HOW TO DO THAT");
        signupPopup.style.display='none';
    }
    return true;
}

// Validates password on sign-in.
function validatePassword(listOfUsernames, username, password){
    if(listOfUsernames.length == 0){
        alert("That user doesn't exist. Did you spell it correctly, or do you actually have an account?");
        return;
    }
    if(password == listOfUsernames[0].password && username == listOfUsernames[0].user_name){
        user.textContent = username;
        userObj = listOfUsernames[0];
        loginPopup.style.display='none';
    }
    else if(username == listOfUsernames[0].user_name){
        alert("Password incorrect, please retry.");
    }
}

// Part of the pop-up logic, shows the signup popup.
showSignupBtn.addEventListener("click", async function(event){
    signupPopup.style.display='block';

});

// Shows login popup, also extremely inefficiently grabs a random asciimoji to throw on there :)
// If your login takes a while it's because of the random ascii art, sorrt
showLoginBtn.addEventListener("click", async function(event){
    if(!begUserNotToPutRealPasswordFired){
        alert("PLEASE don't put in a real password ;~;");
        begUserNotToPutRealPasswordFired = true;
    }
    let rand = Math.floor(Math.random() * 13);
    const result = await fetch("https://techeducatorsweek4-1.onrender.com/asciimoji");
    const listAsciimoji = await result.json();
    asciimoji.textContent = listAsciimoji[rand].display;
    loginPopup.style.display='block';

});

// Signup form.
signupForm.addEventListener("submit", async function(event){
    event.preventDefault();
    
    const formData = new FormData(signupForm);
    const username = formData.get("username");
    const password = formData.get("password");
    const confPassword = formData.get("confpassword");

    let result = await fetch("https://techeducatorsweek4-1.onrender.com/login", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username}),
    });
    let foundUsers = await result.json();

    if(!validateNewUser(foundUsers, username, password, confPassword)){
        return;
    }

    fetch("https://techeducatorsweek4-1.onrender.com/signup", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username, password}),
    });

});

// Login form
loginForm.addEventListener("submit", async function(event){
    event.preventDefault();
    
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    let result = await fetch("https://techeducatorsweek4-1.onrender.com/login", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username}),
    });
    let foundUsers = await result.json();

    validatePassword(foundUsers, username, password);
});

// The message form.
// This one's a bit silly, so I'll inline comment this one.
form.addEventListener("submit", function(event){
    event.preventDefault();

    // This variable is storing the logged-in user.
    // I was going to use local data to remember a logged-in user, but I decided
    // it might be bad taste to do it.
    if(userObj == null){
        alert("You must be signed in to leave a message.\nSorry whoever is marking this...");
        return;
    }

    // This is to keep the number of characters down to a minimum.
    if(parseInt(charCounter.textContent) < 0){
        alert("Too many characters. Please keep it under 500.")
        return;
    }
    
    // Form data is also set, for no real reason. I don't remember why I did this, but there it is.
    const formData = new FormData(messageForm);
    formData.set("userId", userObj.user_id);
    formData.set("userName", userObj.user_name);
    let message = formData.get("message");
    const userId = formData.get("userId");
    const userName = formData.get("userName");

    //This is to allow "'" character to exist. SQL normally doesn't enforce "'" as its only string declaration quote, but Supabase does(?)
    message = message.replaceAll("'", "\\27");

    fetch("https://techeducatorsweek4-1.onrender.com/newpost", {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId, userName, message}),
    });


    // Creates a pseudo-post object, to pretend that we updated the page with the new post. You can't like it, which is very silly. 
    // I don't know a good way of updating a specific part of the page.
    const post = {
        user_id: userId,
        user_name: userName,
        content: message,
        numlikes: 0,
        postdate: Date.now()
    };

    pretendNewPostIsThere(post);
});

// Just listens for inputs to update the character count.
input.addEventListener("input", function(event){
    charCounter.textContent = 500 - [...input.value].length;
});

