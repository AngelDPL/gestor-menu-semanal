from app.extensions import db

class MealPlan(db.Model):
    __tablename__ = "meal_plans"

    id = db.Column(db.Integer, primary_key=True)
    week_start_date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    entries = db.relationship("MealPlanEntry", backref="meal_plan", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "week_start_date": self.week_start_date.isoformat(),
            "entries": [e.to_dict() for e in self.entries if e.recipe is not None]
        }


class MealPlanEntry(db.Model):
    __tablename__ = "meal_plan_entries"

    id = db.Column(db.Integer, primary_key=True)
    day_of_week = db.Column(db.String(10), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)
    meal_plan_id = db.Column(db.Integer, db.ForeignKey("meal_plans.id"), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey("recipes.id"), nullable=False)

    recipe = db.relationship("Recipe")

    def to_dict(self):
        return {
            "id": self.id,
            "day_of_week": self.day_of_week,
            "meal_type": self.meal_type,
            "recipe": self.recipe.to_dict() if self.recipe else None
        }