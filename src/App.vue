<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <router-link class="navbar-brand" to="#">Vue Recipes</router-link>
      <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isNavbarOpen }" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'main' }">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'search' }">Search</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :to="{ name: 'about' }">About</router-link>
          </li>
          <template v-if="$root.store.username">
            <li class="nav-item">
              <span class="nav-link">{{ $root.store.username }}</span>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Profile
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item" :to="{ name: 'favoriteRecipes' }">Favorite Recipes</router-link>
                <router-link class="dropdown-item" :to="{ name: 'myRecipes' }">My Recipes</router-link>
                <router-link class="dropdown-item" :to="{ name: 'familyRecipes' }">Family Recipes</router-link>
              </div>
            </li>
            <li class="nav-item">
              <button class="nav-link btn-link" @click="logout">Disconnect</button>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'createRecipe' }">Create Recipe</router-link>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <span class="nav-link">Hello, Guest</span>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'register' }">Register</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'login' }">Login</router-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
    <footer class="bg-secondary text-white text-center py-3">
      <p>&copy; 2024 Your Company. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isNavbarOpen: false
    };
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    logout() {
      this.$root.store.logout();
      this.$router.push({ name: 'main' });
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

$primary-color: #4a90e2; /* Blue */
$secondary-color: #34495e; /* Dark Gray */
$accent-color: #e74c3c; /* Red */
$background-color: #ecf0f1; /* Light Gray */
$text-color: #2c3e50; /* Dark Text Color */
$white-color: #ffffff;

body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $text-color;
  background-color: $background-color;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $primary-color;
}

.navbar-brand {
  font-weight: 600;
  font-size: 1.5rem;
  color: $white-color;
}

.navbar-toggler {
  background-color: transparent;
  border: none;
  color: $white-color;
  font-size: 1.25rem;
  cursor: pointer;
}

.navbar-collapse {
  flex-basis: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}

.navbar-nav {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
  display: flex;
  align-items: center;
}

.nav-item {
  margin: 0 1rem;
}

.nav-link {
  color: $white-color;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  display: block;
  padding: 0.5rem 1rem;
}

.nav-link:hover,
.nav-link:focus {
  color: $accent-color;
}

.dropdown-menu {
  background-color: $white-color;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  display: none;
  flex-direction: column;
  padding: 0;
}

.dropdown-menu.show {
  display: flex;
}

.dropdown-item {
  color: $text-color;
  padding: 0.5rem 1rem;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background-color: $background-color;
}

.btn-link {
  background: none;
  border: none;
  color: $white-color;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  display: block;
  padding: 0.5rem 1rem;
}

.btn-link:hover,
.btn-link:focus {
  color: $accent-color;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: $background-color;
}

footer {
  padding: 20px;
  text-align: center;
  background-color: $secondary-color;
  color: $white-color;
  border-top: 1px solid darken($secondary-color, 10%);
}

.container {
  padding: 20px;
  margin: auto;
  background-color: $white-color;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

button {
  background-color: $accent-color;
  color: $white-color;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: darken($accent-color, 10%);
  }
}

a {
  color: $primary-color;
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
}

h1, h2, h3, h4, h5, h6 {
  color: $text-color;
  margin-bottom: 20px;
  font-weight: 600;
}

p {
  line-height: 1.6;
  margin-bottom: 20px;
}

input, select, textarea {
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
  &:focus {
    border-color: $accent-color;
    outline: none;
  }
}

form {
  max-width: 600px;
  margin: auto;
  background-color: $white-color;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: $white-color;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.card-header {
  font-weight: 600;
  margin-bottom: 10px;
  color: $primary-color;
}

.card-body {
  color: $text-color;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.table th {
  background-color: $primary-color;
  color: $white-color;
  text-align: left;
}

.table tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}

.alert {
  padding: 20px;
  background-color: $accent-color;
  color: $white-color;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
