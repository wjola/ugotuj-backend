const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  category: {
    type: String,
    lowercase: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  img: {
    type: String,
    required: true,
  },
  ingredients: {
    type: Array,
    required: true,
  },
  spices: {
    type: Array,
  },
  steps: {
    type: Array,
    required: true,
  },
  comments: {
    type: Array,
  },
  liked: {
    type: Boolean,
  },
});

recipeSchema.post("init", function (recipes) {
  const imgPath = recipes.toObject().img;

  recipes._doc.img = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imgPath}`;
  recipes.save();
});

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
