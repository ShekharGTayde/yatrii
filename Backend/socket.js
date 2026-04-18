
import { Server as socketIo } from 'socket.io';
import User from './models/user.model.js'
import Captain from './models/captain.model.js'

let io;

function IniatiazedSocket(server) {
    const normalizeOrigin = (value = '') => {
        const cleaned = String(value).trim().replace(/^['\"]|['\"]$/g, '').replace(/\/+$/, '');
        if (!cleaned) {
            return '';
        }

        try {
            return new URL(cleaned).origin;
        } catch {
            try {
                return new URL(`https://${cleaned}`).origin;
            } catch {
                return cleaned;
            }
        }
    };

    const allowedOrigins = (process.env.CLIENT_URL || '')
        .split(',')
        .map((origin) => normalizeOrigin(origin))
        .filter(Boolean);

    io = new socketIo(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin) {
                    return callback(null, true);
                }

                const normalizedOrigin = normalizeOrigin(origin);

                if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
                    return callback(null, true);
                }

                console.warn(`Socket.IO CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);

                return callback(new Error('Not allowed by CORS'));
            },
            methods: ['GET', 'POST'],
            credentials: true,
        }
    })

    io.on('connection', (socket) => {
        // console.log(`client connected:${socket.id}`)

        
        
        socket.on('join', async (data) => {

            const { userId, userType } = data
            if (!userId || !userType) {
                console.error('Invalid join data:', data);
                return;
            }
            // console.log(`User ${userId} joined as ${userType}`);

            if (userType === 'user') {
                await User.findByIdAndUpdate(userId, { socketId: socket.id })
            } else if (userType === 'captain') {
                await Captain.findByIdAndUpdate(userId, { socketId: socket.id })
            }

        })

        socket.on('update-location-captain',async(data)=>{
            const {userId, location} = data
            if (!userId || !location) {
              socket.emit('error', 'Invalid data for update-location-captain');
              return;
            }
            await Captain.findByIdAndUpdate(userId,
                {
                  location:{
                    ltd:location.ltd,
                    lng:location.lng
                  }
                }
            )
        })

        socket.on('disconnect', () => {
            console.log(`client disconnected:${socket.id}`);

        })
    })
}

export const sendMessageToSocketId = (socketId, messageObject) => {

    // console.log(messageObject);
    
        if (io) {
            io.to(socketId).emit(messageObject.event, messageObject.data);
        } else {
            console.log('Socket.io not initialized.');
        }
    }

    
export default IniatiazedSocket