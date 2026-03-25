const express = require("express")
const { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, getMyRecipes } = require("../controller/recipe")
const verifyToken = require("../middleware/auth")
const router = express.Router()

router.get("/", getRecipes)
router.get("/my-recipes", verifyToken, getMyRecipes)
router.get("/:id", getRecipe)
router.post("/", verifyToken, addRecipe)
router.put("/:id", verifyToken, editRecipe)
router.delete("/:id", verifyToken, deleteRecipe)

module.exports = router