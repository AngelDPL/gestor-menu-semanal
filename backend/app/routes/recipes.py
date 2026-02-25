from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.recipe import Recipe, Ingredient

recipes_bp = Blueprint("recipes", __name__)

@recipes_bp.route("/", methods=["GET"])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    recipes = Recipe.query.filter_by(user_id=user_id).all()
    return jsonify([r.to_dict() for r in recipes]), 200


@recipes_bp.route("/", methods=["POST"])
@jwt_required()
def create_recipe():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "El nombre es obligatorio"}), 400

    recipe = Recipe(
        name=data["name"],
        description=data.get("description", ""),
        calories=data.get("calories", 0),
        protein=data.get("protein", 0),
        carbs=data.get("carbs", 0),
        fat=data.get("fat", 0),
        user_id=user_id
    )

    db.session.add(recipe)
    db.session.flush()

    for ing in data.get("ingredients", []):
        ingredient = Ingredient(
            name=ing["name"],
            quantity=ing["quantity"],
            unit=ing["unit"],
            recipe_id=recipe.id
        )
        db.session.add(ingredient)

    db.session.commit()
    return jsonify(recipe.to_dict()), 201


@recipes_bp.route("/<int:recipe_id>", methods=["PUT"])
@jwt_required()
def update_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first_or_404()
    data = request.get_json()

    recipe.name = data.get("name", recipe.name)
    recipe.description = data.get("description", recipe.description)
    recipe.calories = data.get("calories", recipe.calories)
    recipe.protein = data.get("protein", recipe.protein)
    recipe.carbs = data.get("carbs", recipe.carbs)
    recipe.fat = data.get("fat", recipe.fat)

    if "ingredients" in data:
        Ingredient.query.filter_by(recipe_id=recipe.id).delete()
        for ing in data["ingredients"]:
            ingredient = Ingredient(
                name=ing["name"],
                quantity=ing["quantity"],
                unit=ing["unit"],
                recipe_id=recipe.id
            )
            db.session.add(ingredient)

    db.session.commit()
    return jsonify(recipe.to_dict()), 200


@recipes_bp.route("/<int:recipe_id>", methods=["DELETE"])
@jwt_required()
def delete_recipe(recipe_id):
    user_id = get_jwt_identity()
    recipe = Recipe.query.filter_by(id=recipe_id, user_id=user_id).first_or_404()
    db.session.delete(recipe)
    db.session.commit()
    return jsonify({"message": "Receta eliminada"}), 200