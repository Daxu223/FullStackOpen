const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Please provide the password as an argument: node mongo.js <password>")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://samukollin:${password}@cluster0.jmibqse.mongodb.net/numberApp?retryWrites=true&w=majority&appName=Cluster0`
// 

mongoose.set("strictQuery", false)
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Number = mongoose.model("Number", numberSchema)

if (process.argv.length == 5) {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4]
    })

    number.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Number.find({}).then(result => {
        console.log("phonebook:")
            result.forEach(note => {
            console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
    })
}
