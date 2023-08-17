# Northcoders News API

# For Developers

# Hosted Version
https://nc-news-liam.onrender.com/

# Summary
This code gets access to a database and the server listens to any requests made by users online, only the listed requests in endpoints.json or /api are accepted. We allow the user to get, patch, post and delete data provided they do it in the correct format. 

This code can be ran with test-data to ensure no real data is lost and every request is correctly tested for any malicious intentions or mistakes.

# Instructions
To clone this code:
1.  Please fork the repo to make your own version
2.  Click code and then copy the link under HTTPs
3.  Open Visual Studio Code and then type 'git clone <URL>' (replace <URL> with the link)
4.  Install dependencies using 'npm i' or install each dependency individually. List of devdependencies you need ["husky", "jest", "jest-extended", "jest-sorted", "pg-format"]. Please see package.json devdependencies for exact dependencies needed.
5.  To make your own environment variables please make .env.development and .env.test files which will hold the name of the databases you make. Make sure those files are in .gitignore in order to not leak your database names. To create your databases run the setup.sql file, adjusting the names as you see fit, after creating the databases now you can do 'npm run seed' which will make the necessary tables and insert the data into them. 
6.  To run tests ensure package.json has a script 'test: "jest"' (will not work without jest dependency) and then run 'npm t'

If you have any problems please read the instructions above again and ensure the names to the databases are correct. This will not run without the required dependencies

# Minimum versions
Nodes.js : ^v20.4.0
Postgres : ^8.11.2



