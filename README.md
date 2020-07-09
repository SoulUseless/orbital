Please view this as raw for maximum ease.

# orbital - development build

To run it, you will require:
- Nodejs
- /frontend/.env for frontend secret keys and environments*
- /backend/nodemon.json for backend secret keys and environments*  
*These should be disseminated via link on nus-skylabs, otherwise please highlight using the feedback section. Otherwise, you can create your own secret keys.

The format for the secret key files are as follows:  
>/frontend/.env
>> `REACT_APP_BACKEND_URL=http://localhost:5000/api `   
>> `REACT_APP_ASSET_URL=http://localhost:5000`  

> /backend/nodemon.json -- this file contains more sensitive information
>> `{`  
>> `  "env" : {`  
>> `    "DB_USER": <mongodb userid>,`  
>> `    "DB_PW": <mongodb password>,`  
>> `    "DB_NAME": <mongodb collection name>,`  
>> `    "JWT_SECRET": <jsonwebtoken secret key>,`  
>> `    "JDOODLE_ID": <jdoodle id>, //not required for this milestone, havent implement this functionality`  
>> `    "JDOODLE_SECRET": <jdoodle secret key> //not required for this milestone, havent implement this functionality`  
>> `  }`  
>>`}`     


# Getting it Running
1. Download the repo, either through pulling or downloading.
2. Using Command Prompt (or equivalent), navigate to the place that you stored the files (One instance for frontend, another for backend).
3. In /frontend and /backend, run `npm install` to install all dependencies. This might take a while.
4. Check your secret key files are in place.
5. Run `npm start` in both /frontend and /backend.
6. By default, the frontend will be hosted on `localhost:3000`, while backend will be hosted on `localhost:5000`.

# Common Problems and possible workarounds
> Unable to connect to Mongo (ECONNREFUSED <your-ip-address)  
>> 1. Ensure you have the secret keys in the correct directories. (Lack of validation credentials)
>> 2. Switch to your phone hotspot for network access. (Router could have network access controls on ports)
>> 3. Set up your own MongoDB credentials. 

> Inability to create multiple documents (if setting up own MongoDB)
>> Create the following document system: (MongoDB does not allow multiple document transactions)  
>> `orbital`  
>> `| challenges`  
>> `| courses`  
>> `| languages`  
>> `| startupchallenges`  
>> `| startups`  
>> `| students`  
>> `| submissions`  
>> `| tiers`  

