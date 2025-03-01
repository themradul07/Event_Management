import mongoose from "mongoose"

const DbCon = async () => {

    try {
        
        await mongoose.connect("mongodb://127.0.0.1:27017/BietHub")
        console.log("MongoDb is connected")
    } catch (error) {
        console.log("Not connected", error)
        
    }
  
}

export default DbCon;
