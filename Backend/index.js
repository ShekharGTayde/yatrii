import http from 'http'
import IniatiazedSocket from './socket.js'
import  app  from './app.js'
import dotenv, { config } from 'dotenv'
import connectdb from './db/db.js'



dotenv.config ({
    path:'./.env'
})

connectdb()



const port = process.env.PORT || 3000



const server = http.createServer(app)
IniatiazedSocket(server)



server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});