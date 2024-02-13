
import mongoose from "mongoose"
const mongoConnect = () => {

    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    mongoose.connect(`${MONGODB_URI}/discount-bxgy-adn`)
        .then(() => { console.log("mongoDB connection successful...") })
        .catch((error) => { console.log(error) })
}

export default mongoConnect
