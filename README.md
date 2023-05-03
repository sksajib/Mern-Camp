# Mern-Camp
#client
open the directory /client in the terminal and run <npm install>
It will download the node_modules and .next folders 
Run the command <npm run dev > to run the client in the address (localhost:3030)
Change the port of client  : Go to package.json file
                             Search for set PORT:3030
                             change 3030 to the desired port or for default port just delete <set PORT:3030 &&>
                           
                           
#Server
open the directory in another terminal.Make sure to Keep the client terminal and server running without any errors.
Run the command <npm install> .It will download the node_modules 
Create .env file in the root of the server folder .
#In .env file enter below lines:
DATABASE=MONGODB ATLAS DATABASE CONNECTION STRING (Make sure to give the username and password correctly)
PORT:3006(Give any free port in which the server will run)
Run <npm start> 

