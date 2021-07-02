const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("File", fileSchema);
