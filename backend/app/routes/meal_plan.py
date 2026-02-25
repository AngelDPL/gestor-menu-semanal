from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.meal_plan import MealPlan, MealPlanEntry
from app.models.recipe import Recipe
from datetime import date

meal_plan_bp = Blueprint("meal_plan", __name__)

@meal_plan_bp.route("/", methods=["GET"])
@jwt_required()
def get_meal_plans():
    user_id = get_jwt_identity()
    plans = MealPlan.query.filter_by(user_id=user_id).all()
    return jsonify([p.to_dict() for p in plans]), 200


@meal_plan_bp.route("/", methods=["POST"])
@jwt_required()
def create_meal_plan():
    user_id = get_jwt_identity()
    data = request.get_json()

    if not data or "week_start_date" not in data:
        return jsonify({"error": "Falta la fecha de inicio de semana"}), 400

    week_start = date.fromisoformat(data["week_start_date"])

    plan = MealPlan(week_start_date=week_start, user_id=user_id)
    db.session.add(plan)
    db.session.flush()

    for entry in data.get("entries", []):
        meal_entry = MealPlanEntry(
            day_of_week=entry["day_of_week"],
            meal_type=entry["meal_type"],
            recipe_id=entry["recipe_id"],
            meal_plan_id=plan.id
        )
        db.session.add(meal_entry)

    db.session.commit()
    return jsonify(plan.to_dict()), 201


@meal_plan_bp.route("/<int:plan_id>", methods=["DELETE"])
@jwt_required()
def delete_meal_plan(plan_id):
    user_id = get_jwt_identity()
    plan = MealPlan.query.filter_by(id=plan_id, user_id=user_id).first_or_404()
    db.session.delete(plan)
    db.session.commit()
    return jsonify({"message": "Plan eliminado"}), 200