const mongoose = require('mongoose')

// IMPORTANT: If you switch the places of the elements,
// it is shown exactly in the same order in the website.
// Not in alphabetical order.
const userSchema = new mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    required: true,
    unique: true // Only one username per collection
  },
  name: String,
  passwordHash: String
})

// Modify userSchema JSON format so we don't show the hash in the api
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString() // Transform _id to id
    delete returnedObject._id // Delete _id
    delete returnedObject.__v // Delete _v
    delete returnedObject.passwordHash // Delete hash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User