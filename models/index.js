const mongoose = require('mongoose');
const dbConfig = require('../config/db.config');

module.exports = {
    async connectDB() {
        try {
            mongoose.set('strictQuery', true)
            await mongoose.connect(dbConfig.URI, {
                useNewUrlParser: true,
            })

            console.log('Connected to database')
        } catch (err) {
            console.error(err);
            process.exit(1)
        }
    }
}
