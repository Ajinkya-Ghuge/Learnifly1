from flask import Flask, request, jsonify, session, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'

db = SQLAlchemy(app)

# 📦 User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# 🛠 Create DB
with app.app_context():
    db.create_all()

# 🌐 Landing Page
@app.route('/')
def home2():
    return render_template('home2.html')

# 🔁 Smart Start Button Redirect
@app.route('/start')
def start():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    else:
        return redirect(url_for('login'))

# 🧑‍💻 Dashboard
@app.route('/dashboard')
def dashboard():
    if 'user_id' in session:
        return render_template('home.html')  # You can change to dashboard.html later
    else:
        return redirect(url_for('login'))

# 🔐 Signup
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        if not name or not email or not password:
            return jsonify({"status": "error", "message": "Missing fields!"}), 400
        if User.query.filter_by(email=email).first():
            return jsonify({"status": "error", "message": "Email already registered!"}), 409
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    return render_template('signup.html')

# 🔑 Login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['user_name'] = user.name
            session['user_email'] = user.email
            return redirect(url_for('dashboard'))
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401
    return render_template('login.html')

# 🚪 Logout
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

# 👤 Profile
@app.route('/profile')
def profile():
    if 'user_id' in session:
        return render_template('profile.html')
    else:
        return redirect(url_for('login'))

# 📚 Topic Page
@app.route('/topic.html')
def topic():
    return render_template('topic.html')

if __name__ == '__main__':
    app.run(debug=True, port=5006)