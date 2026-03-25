const getDb = require("../config/connectionDb")

const getRecipes = async (req, res) => {
    const { q } = req.query;
    const db = await getDb()

    let query = "SELECT * FROM recipes";
    let params = [];

    if (q) {
        query += " WHERE title LIKE ? OR ingredients LIKE ? OR category LIKE ?";
        params = [`%${q}%`, `%${q}%`, `%${q}%`];
    }

    const recipes = await db.all(query, params)
    const formattedRecipes = recipes.map(r => ({
        ...r,
        ingredients: JSON.parse(r.ingredients || '[]')
    }))
    return res.json(formattedRecipes)
}

const getRecipe = async (req, res) => {
    const db = await getDb()
    const recipe = await db.get(`SELECT * FROM recipes WHERE id = ?`, [req.params.id])
    if (recipe) {
        recipe.ingredients = JSON.parse(recipe.ingredients || '[]')
        res.json(recipe)
    } else {
        res.status(404).json({ message: "Recipe not found" })
    }
}

const addRecipe = async (req, res) => {
    const { title, ingredients, instructions, cookTime, servings, coverImage, category } = req.body
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: "Required fields can't be empty" })
    }

    const db = await getDb()
    const ingredientsStr = JSON.stringify(ingredients)
    const result = await db.run(
        `INSERT INTO recipes (title, ingredients, instructions, category, cookTime, servings, coverImage, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, ingredientsStr, instructions, category, cookTime, servings, coverImage, req.user.id]
    )

    return res.json({
        id: result.lastID,
        title,
        ingredients,
        instructions,
        category,
        cookTime,
        servings,
        coverImage,
        createdBy: req.user.id
    })
}

const editRecipe = async (req, res) => {
    const { title, ingredients, instructions, cookTime, servings, coverImage, category } = req.body
    const db = await getDb()
    let recipe = await db.get(`SELECT * FROM recipes WHERE id = ?`, [req.params.id])

    try {
        if (recipe) {
            // Ownership check
            if (recipe.createdBy !== req.user.id) {
                return res.status(403).json({ message: "You are not authorized to edit this recipe" })
            }

            const ingredientsStr = ingredients ? JSON.stringify(ingredients) : recipe.ingredients;
            const updatedTitle = title || recipe.title;
            const updatedInstructions = instructions || recipe.instructions;
            const updatedCategory = category || recipe.category;
            const updatedCookTime = cookTime || recipe.cookTime;
            const updatedServings = servings || recipe.servings;
            const updatedCoverImage = coverImage || recipe.coverImage;

            await db.run(
                `UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, category = ?, cookTime = ?, servings = ?, coverImage = ? WHERE id = ?`,
                [updatedTitle, ingredientsStr, updatedInstructions, updatedCategory, updatedCookTime, updatedServings, updatedCoverImage, req.params.id]
            )
            res.json({
                id: parseInt(req.params.id),
                title: updatedTitle,
                ingredients: ingredients || JSON.parse(recipe.ingredients || '[]'),
                instructions: updatedInstructions,
                category: updatedCategory,
                cookTime: updatedCookTime,
                servings: updatedServings,
                coverImage: updatedCoverImage,
                createdBy: recipe.createdBy
            })
        } else {
            res.status(404).json({ message: "Recipe not found" })
        }
    }
    catch (err) {
        return res.status(400).json({ message: err.message })
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const db = await getDb()
        const recipe = await db.get(`SELECT * FROM recipes WHERE id = ?`, [req.params.id])

        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" })
        }

        // Ownership check
        if (recipe.createdBy !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this recipe" })
        }

        await db.run(`DELETE FROM recipes WHERE id = ?`, [req.params.id])
        res.json({ status: "ok" })
    }
    catch (err) {
        return res.status(400).json({ message: "error" })
    }
}

const getMyRecipes = async (req, res) => {
    const db = await getDb()
    const recipes = await db.all(`SELECT * FROM recipes WHERE createdBy = ?`, [req.user.id])
    const formattedRecipes = recipes.map(r => ({
        ...r,
        ingredients: JSON.parse(r.ingredients || '[]')
    }))
    return res.json(formattedRecipes)
}

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, getMyRecipes }