const express = require("express");
// Importujemy model
const Recipe = require("../models/Recipe.model");
const uploadImg = require("../services/file-upload");

// Tworzymy router
const router = new express.Router();

router.post("/recipes", uploadImg.single("img"), async (req, res) => {
  const recipeInput = req.body;
  recipeInput.ingredients = JSON.parse(recipeInput.ingredients);
  recipeInput.spices = JSON.parse(recipeInput.spices);
  recipeInput.steps = JSON.parse(recipeInput.steps);
  recipeInput.comments = JSON.parse(recipeInput.comments);
  recipeInput.img = req.file.key;

  try {
    const recipe = new Recipe(recipeInput);
    await recipe.save();
    res.send(recipe);
  } catch (err) {
    console.error(err);

    res.status(400).send(err);
  }
});

// Określamy co router ma robić
router.patch("/recipe/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: req.params.recipeId },
      { $set: { liked: req.body.liked } },
      {
        returnOriginal: false,
      }
    );
    res.send(updatedRecipe);
  } catch (err) {
    console.error(err);

    res.status(400).send(err);
  }
});

router.get("/recipes/liked", async (req, res) => {
  try {
    const recipes = await Recipe.find({
      liked: { $eq: true },
    });
    res.send(recipes);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

router.get("/recipes/:category?", async (req, res) => {
  try {
    const category = req.params.category;
    const recipes = await Recipe.find(category ? { category } : null);

    res.send(recipes);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

router.get("/recipes/search/:searchPhrase", async (req, res) => {
  try {
    const searchPhrase = req.params.searchPhrase;
    const regex = new RegExp(searchPhrase);

    const recipes = await Recipe.find({
      name: { $regex: regex, $options: "gi" },
    });
    res.send(recipes);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

router.get("/recipe/:recipe_id", async (req, res) => {
  try {
    const recipe = await Recipe.find({
      _id: req.params.recipe_id,
    });
    res.send(recipe);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
});

// Eksportujemy router
module.exports = router;
