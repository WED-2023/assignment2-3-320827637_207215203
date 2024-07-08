import Main from "./pages/MainPage";
import NotFound from "./pages/NotFoundPage";
import FavoriteRecipesPage from "@/pages/FavoriteRecipesPage.vue";

function MyRecipesPage() {

}

function FamilyRecipesPage() {

}

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./pages/RegisterPage"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./pages/LoginPage"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("./pages/SearchPage"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./pages/AboutPage"),
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => import("./pages/RecipeViewPage.vue"),
  },
  {
    path: "/favoriteRecipes",
    name: "favoriteRecipes",
    component: () => import("./pages/FavoriteRecipesPage.vue"),

  },
  {
    path: "/myRecipes",
    name: "myRecipes",
    component: () => import("./pages/MyRecipesPage.vue"),
  },
  {
    path: "/familyRecipes",
    name: "familyRecipes",
    component: () => import("./pages/FamilyRecipesPage.vue"),
  },
  {
    path: "/createRecipe",
    name: "createRecipe",
    component: () => import("./pages/CreateRecipePage.vue"),
  },
  {
    path: "*",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;
