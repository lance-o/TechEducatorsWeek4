I'm going to keep it a bit shorter this week!

# user Stories

## Create a page containing a form to leave a message and a list of all the messages that have been left

I've done that, though I may have gotten carried away a little bit.

## Style the form so they're easy to read on phone and PC

I've done a little bit of media querying, but I think it should be easy enough to read as-is.

## Create an API POST route to accept the text from your form

This works, too! I have some experience with SQL already (admittedly, less than I remembered), so working with it remotely was mostly getting used to the workflow.

# Requirements

## Page contains a form to leave a message
Done

## Style the form
Yeah

## API POST route
Done

## Database to store messages
Present, though I must admit I don't know how seed file is supposed to be run. Is it just manual?
It's not set up to be automatic on my project, instead I've just been running 'node seed'

## GET route to retrieve messages
It's there.

## Fetch messages from API in browser and display them on the page
Also works just fine

# Stretch goals

## Delete button
I did not go for this one.

## Like button
I did do this one. It doesn't work great, it's very janky. Ideally, I'd do this using some sort of count method; +1 for each user with an account that has liked it.

## Other
I did a very small foreign key thing. I know how relational databases work more or less, but it's been a while since I've done anything like that.

# Feedback
OH BOY.
I'm sure this will be a common sentiment among the others, but this was by far the hardest one yet. I think, more than anything, it's very time-consuming getting everything set up. I spent pretty much all of Thursday and Friday doing this, and I'm writing this at 6PM on Friday.

The #1 bug for me; THIS CHARACTER "'" IS ILLEGAL in text objects on Supabase, and I worked around this by just transforming the character when it's entered into the database which seems wrong. I spent ages unsure of what was causing the issue. 
It's probably less of a "it's not supported" issue, and more of a syntax issue; I was still unable to fix it the "proper" way, though.