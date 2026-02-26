from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data or not all(k in data for k in ("username", "email", "password")):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "El email ya está registrado"}), 409

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "El nombre de usuario ya existe"}), 409

    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Usuario creado correctamente", "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not user.check_password(data["password"]):
        return jsonify({"error": "Credenciales incorrectas"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({"access_token": token, "user": user.to_dict()}), 200


@auth_bp.route("/update", methods=["POST"])
@jwt_required()
def update_info():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if "username" in data:
        existing = User.query.filter_by(username=data["username"]).first()
        if existing and existing.id != user.id:
            return jsonify({"error": "El nombre de usuario ya existe"}), 409
        user.username = data["username"]

    if "email" in data:
        existing = User.query.filter_by(email=data["email"]).first()
        if existing and existing.id != user.id:
            return jsonify({"error": "El email ya está registrado"}), 409
        user.email = data["email"]

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@auth_bp.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()

    if not user.check_password(data.get("current_password", "")):
        return jsonify({"error": "La contraseña actual es incorrecta"}), 401

    user.set_password(data["new_password"])
    db.session.commit()
    return jsonify({"message": "Contraseña actualizada"}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user.to_dict()), 200