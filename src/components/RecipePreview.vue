<template>
  <router-link
      :to="{ name: 'recipe', params: { recipeId: recipe.id } }"
      class="recipe-preview"
      :class="{ 'recipe-seen': hasBeenSeen }"
  >
    <div class="recipe-body">
      <img :src="recipe.image" class="recipe-image"  alt=""/>
    </div>
    <div class="recipe-footer">
      <div :title="recipe.title" class="recipe-title">
        {{ recipe.title }}
      </div>
      <ul class="recipe-overview">
        <li><strong>Preparation Time:</strong> {{ recipe.readyInMinutes }} Minutes</li>
        <li><strong>Likes:</strong> {{ recipe.aggregateLikes }}</li>
        <li><strong>Vegetarian:</strong> {{ recipe.vegetarian ? 'Yes' : 'No' }}</li>
        <li><strong>Vegan:</strong> {{ recipe.vegan ? 'Yes' : 'No' }}</li>
        <li><strong>Gluten Free:</strong> {{ recipe.glutenFree ? 'Yes' : 'No' }}</li>
      </ul>
    </div>
  </router-link>
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
  watch: {
    '$route'(to, from) {
      console.log('Route changed:', to.params.recipeId);
      if (to.params.recipeId && to.params.recipeId !== from.params.recipeId) {
        console.log('Marking recipe as seen:', to.params.recipeId);
        userBus.markRecipeAsSeen(to.params.recipeId);
      }
    }
  },
  computed: {
    hasBeenSeen() {
      return userBus.hasSeenRecipe(this.recipe.id);
    }
  }
};
</script>

<style scoped>
.recipe-preview {
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 100%;
  margin: 10px 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.recipe-seen {
  opacity: 0.5;
}

.recipe-preview > .recipe-body {
  width: 100%;
  height: 200px;
  position: relative;
  border-bottom: 1px solid #ddd;
}

.recipe-preview .recipe-body .recipe-image {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.recipe-preview .recipe-footer {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
}

.recipe-preview .recipe-footer .recipe-title {
  font-size: 16pt;
  text-align: left;
  font-weight: bold;
  margin-bottom: 10px;
}

.recipe-preview .recipe-footer ul.recipe-overview {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.recipe-preview .recipe-footer ul.recipe-overview li {
  font-size: 12pt;
  text-align: left;
}

.recipe-preview .recipe-body .recipe-image:hover {
  transform: scale(1.05);
  cursor: pointer;
}
</style>