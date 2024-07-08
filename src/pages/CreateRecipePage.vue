<template>
  <div>
    <b-button v-b-modal.modal-1>New Recipe</b-button>

    <b-modal id="modal-1" title="Create New Recipe" hide-footer>
      <b-form @submit.prevent="onSubmit">
        <!-- Recipe Title -->
        <b-form-group label="Recipe Title:" label-for="recipe-title">
          <b-form-input id="recipe-title" v-model="recipe.title" required></b-form-input>
        </b-form-group>

        <!-- Preparation Time -->
        <b-form-group label="Preparation Time (minutes):" label-for="recipe-readyInMinutes">
          <b-form-input id="recipe-readyInMinutes" v-model="recipe.readyInMinutes" type="number" required></b-form-input>
        </b-form-group>

        <!-- Aggregate Likes -->
        <b-form-group label="Likes:" label-for="recipe-aggregateLikes">
          <b-form-input id="recipe-aggregateLikes" v-model="recipe.aggregateLikes" type="number" required></b-form-input>
        </b-form-group>

        <!-- Dietary Preferences -->
        <b-form-checkbox v-model="recipe.vegetarian" id="vegetarian">
          Vegetarian
        </b-form-checkbox>
        <b-form-checkbox v-model="recipe.vegan" id="vegan">
          Vegan
        </b-form-checkbox>
        <b-form-checkbox v-model="recipe.glutenFree" id="gluten-free">
          Gluten-Free
        </b-form-checkbox>

        <!-- Description -->
        <b-form-group label="Description:" label-for="recipe-description">
          <b-form-textarea 
            id="recipe-description" 
            v-model="recipe.description" 
            rows="3" 
            max-rows="6"
            required>
          </b-form-textarea>
        </b-form-group>

        <!-- Ingredients -->
        <b-form-group label="Ingredients:" label-for="recipe-ingredients">
          <b-form-textarea 
            id="recipe-ingredients" 
            v-model="recipe.ingredients" 
            placeholder="List each ingredient on a new line" 
            rows="4" 
            required>
          </b-form-textarea>
        </b-form-group>

        <!-- Instructions -->
        <b-form-group label="Instructions:" label-for="recipe-instructions">
          <b-form-textarea 
            id="recipe-instructions" 
            v-model="recipe.instructions" 
            placeholder="Step-by-step instructions" 
            rows="5" 
            required>
          </b-form-textarea>
        </b-form-group>

        <b-button type="submit" variant="primary">Create Recipe</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: {
        title: '',
        readyInMinutes: 45,
        aggregateLikes: 0,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        description: '',
        ingredients: '',
        instructions: ''
      }
    };
  },
  methods: {
    onSubmit() {
      console.log('Recipe Data:', this.recipe);
      // Here you would typically make an API call to save the recipe data
      alert('Recipe created successfully!');
      // Optionally clear the form or redirect the user
    }
  }
};
</script>

<style scoped>
</style>