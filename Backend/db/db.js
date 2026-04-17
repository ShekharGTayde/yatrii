import mongoose from "mongoose";
import dns from "node:dns";

const connectDb = async() => {
    try {
        const mongoUrl = process.env.MONGODB_URL;
        const mongoDbName = process.env.MONGODB_NAME;

        if (!mongoUrl) {
            throw new Error("MONGODB_URL is missing in environment variables");
        }

        // If the URL already contains a database name, use it as-is.
        // Otherwise pass dbName explicitly to avoid malformed string concatenation.
        const parsedUrl = new URL(mongoUrl);
        const hasDbInPath = parsedUrl.pathname && parsedUrl.pathname !== "/";

        const connectOptions = {};
        if (!hasDbInPath && mongoDbName) {
            connectOptions.dbName = mongoDbName;
        }

        try {
            await mongoose.connect(mongoUrl, connectOptions)
        } catch (error) {
            const isSrvDnsRefused =
                error?.code === "ECONNREFUSED" && error?.syscall === "querySrv";

            if (!isSrvDnsRefused) {
                throw error;
            }

            const fallbackDnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
                .split(",")
                .map((server) => server.trim())
                .filter(Boolean);

            dns.setServers(fallbackDnsServers);
            console.warn(
                `System DNS refused SRV lookup. Retrying MongoDB connection with DNS servers: ${fallbackDnsServers.join(", ")}`
            );

            await mongoose.connect(mongoUrl, connectOptions);
        }
        console.log(`mongoDb connected successfully at port:${process.env.PORT}`);
        
    } catch (error) {
        console.log('ERROR:',error);
        process.exit(1)
        
    }
}

export default connectDb;