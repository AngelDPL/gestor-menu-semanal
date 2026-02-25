from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.shopping import ShoppingItem
from app.models.meal_plan import MealPlan, MealPlanEntry
from app.models.recipe import Ingredient

shopping_bp = Blueprint("shopping", __name__)

@shopping_bp.route("/generate/<int:plan_id>", methods=["POST"])
@jwt_required()
def generate_shopping_list(plan_id):
    user_id = get_jwt_identity()
    plan = MealPlan.query.filter_by(id=plan_id, user_id=user_id).first_or_404()

    # Borrar lista anterior si existe
    ShoppingItem.query.filter_by(meal_plan_id=plan_id).delete()

    # Agregar ingredientes de todas las recetas del plan
    items = {}
    for entry in plan.entries:
        for ing in entry.recipe.ingredients:
            key = (ing.name, ing.unit)
            if key in items:
                items[key] += ing.quantity
            else:
                items[key] = ing.quantity

    for (name, unit), quantity in items.items():
        item = ShoppingItem(name=name, quantity=quantity, unit=unit, meal_plan_id=plan_id)
        db.session.add(item)

    db.session.commit()

    result = ShoppingItem.query.filter_by(meal_plan_id=plan_id).all()
    return jsonify([i.to_dict() for i in result]), 201


@shopping_bp.route("/<int:plan_id>", methods=["GET"])
@jwt_required()
def get_shopping_list(plan_id):
    user_id = get_jwt_identity()
    MealPlan.query.filter_by(id=plan_id, user_id=user_id).first_or_404()
    items = ShoppingItem.query.filter_by(meal_plan_id=plan_id).all()
    return jsonify([i.to_dict() for i in items]), 200


@shopping_bp.route("/item/<int:item_id>/toggle", methods=["PATCH"])
@jwt_required()
def toggle_item(item_id):
    item = ShoppingItem.query.get_or_404(item_id)
    item.checked = not item.checked
    db.session.commit()
    return jsonify(item.to_dict()), 200