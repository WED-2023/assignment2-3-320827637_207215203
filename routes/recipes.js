var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));

/**
 * This path is for searching a recipe
 */
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.recipeName;
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerance = req.query.intolerance;
    const number = req.query.number || 5;
    const results = await recipes_utils.searchRecipe({query, cuisine, diet, intolerance, number});
    res.send(results);
  } catch (error) {
    next(error);
  }
});

router.get('/familyRecipes', async (req, res, next) => {
  console.log('Getting family recipes');
  try {
    const familyRecipes = await recipes_utils.getFamilyRecipes();
    console.log('Family recipes:', familyRecipes);
    res.status(200).send(familyRecipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns 3 random recipes for the main page
 */
router.get("/randomRecipes", async (req, res, next) => {
  try {
    const result = await recipes_utils.getRandomRecipes();
    res.status(200).send({ recipes: result });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/recipe/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeInformation(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

router.get('/:recipe_id', async (req, res, next) => {
  try {
    const recipe_id = req.params.recipe_id;
    const recipe = await recipe_utils.getRecipeById(recipe_id);
    res.status(200).send(recipe);
  } catch (error) {
    res.status(404).send({ message: "Recipe not found", success: false });
  }
});


module.exports = router;

