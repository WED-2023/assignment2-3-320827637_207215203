<template>
  <div v-if="recipe">
    <div class="recipe-header mt-3 mb-4">
      <h1>{{ recipe.title }}</h1>
      <img :src="recipe.image" class="center" />
    </div>
    <div class="recipe-body">
      <div class="instructions">
        Instructions:
        <ol>
          <li v-for="s in recipe._instructions" :key="s.number">
            {{ s.step }}
          </li>
        </ol>
      </div>
      <div class="recipe-details">
        <div class="mb-3">
          <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
          <div>Likes: {{ recipe.aggregateLikes }} likes</div>
          <div>Servings: {{ recipe.servings }}</div>
        </div>
        <div class="mb-3">
          <div>Vegetarian: {{ recipe.vegetarian ? "Yes" : "No" }}</div>
          <div>Vegan: {{ recipe.vegan ? "Yes" : "No" }}</div>
          <div>Gluten Free: {{ recipe.glutenFree ? "Yes" : "No" }}</div>
        </div>
        Ingredients:
        <ul>
          <li
              v-for="(r, index) in recipe.extendedIngredients"
              :key="index + '_' + r.id"
          >
            {{ r.original }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { userBus } from '../services/userBus.js';

export default {
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.recipeId) {
      console.log('Marking recipe as seen:', to.params.recipeId);
      userBus.markRecipeAsSeen(to.params.recipeId);
    }
    next();
  },
  computed: {
    hasBeenSeen() {
      return userBus.hasSeenRecipe(this.recipe.id);
    }
  }
};
</script>

<style scoped>
.recipe-body {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.instructions {
  flex: 1;
  margin-right: 20px;
}

.recipe-details {
  flex: 2;
}
</style>