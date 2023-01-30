const mongoose = require('mongoose');
const chalk = require('chalk')
const connectDB  = async () => {
    const options = {
        useNewUrlParser: true,
      useUnifiedTopology: true,
      };
    try {
        mongoose.set('strictQuery', true);
        const res = await mongoose.connect(process.env.MONGO_URI,options);
        console.log(chalk.blue("Database connected with collection:") +chalk.white(res.connection.db.namespace));
    } catch (error) {
        console.log(chalk.red(error + "in mongoDB"));
    }
}

module.exports = connectDB;