var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});


/**
 * This path adds the watch recipe to the logged in user
 */
router.post('/markAsWatched', async (req, res, next) => {
  try {
    const recipe_id = req.body.recipeId;
    const user_id = req.session.user_id;

    // Call the AddToWatchedRecipes function
    await user_utils.addToWatchedRecipes(user_id, recipe_id);

    res.status(201).send("Watched recipes added successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * This path shows the three latest recipes that the user watched
 */
router.get('/getRecentWatched', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    let recent_watched_recipes = await user_utils.getRecentWatchedRecipes(user_id);
    recent_watched_recipes = await recipe_utils.getRecipesPreview(recent_watched_recipes);

    res.status(200).send({ recipes: recent_watched_recipes });
  } catch (error) {
    next(error);
  }
});


/**
 * This path adds a personal recipe of the logge in user to the database
 */
router.post('/createPersonalRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const vegan = req.body.vegan ? 1 : 0;
    const glutenFree = req.body.glutenFree ? 1 : 0;
    const vegetarian = req.body.vegetarian ? 1 : 0;

    const recipe_details = {
      user_id,
      title: req.body.title,
      readyInMinutes: req.body.readyInMinutes,
      image: req.body.image,
      servings: req.body.servings,
      popularity: req.body.popularity,
      vegan,
      vegetarian,
      glutenFree,
      extendedIngredients: req.body.extendedIngredients,
      instructions: req.body.instructions
    };

    await user_utils.addPersonalRecipes(recipe_details);
    res.status(201).send("Personal recipe added successfully");
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns a preview of a personal recipe of the logged in user
 */
router.get('/getPreviewPersonalRecipe', async (req, res) => {
  try {
    const user_id = req.session.user_id;
    const preview_personal_recipes = await user_utils.getPreviewPersonalRecipes(user_id);
    
    console.log(preview_personal_recipes)
    res.status(200).send({preview_personal_recipes});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * This path returns a detailed personal recipe of the logged in user
 */
router.get('/GetDetailedPersonalRecipe', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const full_personal_recipes = await user_utils.getFullPersonalRecipes(user_id);
    
    res.status(200).send({ full_personal_recipes });
  } catch (error) {
    next(error);
  }
});


/**
 * This path checks if the user watched or added recipes to favorites using a list of recipe IDs.
 * Returns a list that for each ID contains: {watched_bool, favorite_bool}
 */
router.get("/CheckFavoriteWatched/:recipeIds", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const ids_list = req.params.recipeIds.split(',');
    console.log('Recipe IDs received:', ids_list);

    const results = await Promise.all(ids_list.map(async (recipe_id) => {
      const status = await user_utils.checkWatchedOrFavorite(recipe_id, user_id);
      return { [recipe_id]: status };
    }));

    const response = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});


/**
 * This path checks if the user watched or added recipes to favorites using a list of recipe IDs.
 * Returns a list that for each ID contains: {watched_bool, favorite_bool}
 */
router.get("/CheckFavoriteWatched/:recipeIds", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const ids_list = req.params.recipeIds.split(',');
    console.log('Recipe IDs received:', ids_list);

    const results = await Promise.all(ids_list.map(async (recipe_id) => {
      const status = await user_utils.checkWatchedOrFavorite(recipe_id, user_id);
      return { [recipe_id]: status };
    }));

    const response = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});


/**
 * This path returns preview of the family recipes of the logged in user
 */
router.get('/GetPreviewFamilyRecipes', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const result = await user_utils.getFamilyPreviewRecipes(user_id);
    
    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full view of a family recipe of the logged in user
 */
router.get('/GetFamilyRecipe/:recipe_id', async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    const recipe_id = req.params.recipe_id;
    const result = await user_utils.getFamilyRecipeFullView(user_id, recipe_id);
    
    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
