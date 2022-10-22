const mongoose = require('mongoose')

// I believe we need 5 planet properties along with its name so that we can assign all that data 
// with respective properties in order to filter them out. It is not just about saving those 8 
// planet names. and in that all will be required cuz each one of them is critical.
//aaah it is about what you push to the db and there you are already pushing those 8 planets
// whose only name is what you need.

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true
  },

})

module.exports = mongoose.model('Planet', planetsSchema)