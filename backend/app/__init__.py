from flask import Flask
from .extensions import db, jwt, cors
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    # Registrar rutas
    from .routes.auth import auth_bp
    from .routes.recipes import recipes_bp
    from .routes.meal_plan import meal_plan_bp
    from .routes.shopping import shopping_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(recipes_bp, url_prefix="/api/recipes")
    app.register_blueprint(meal_plan_bp, url_prefix="/api/meal-plan")
    app.register_blueprint(shopping_bp, url_prefix="/api/shopping")

    with app.app_context():
        db.create_all()

    return app