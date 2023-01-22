const mongoose= require("mongoose");
//mongoose.set('strictQuery', false);

const connenctDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
        })
        console.log("MongoDB connected")
    }catch(error){
        console.error(`Error:${error.message}`);
        process.exit(1);
    }

}//
module.exports= connenctDB;