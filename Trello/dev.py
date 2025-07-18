from flask import Flask, request, jsonify
import jwt
import random
from datetime import datetime, timedelta, timezone
import json
import smtplib
from passlib.context import CryptContext
from flask_cors import  CORS
from typing_extensions import deprecated

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
app=Flask(__name__)


CORS(app)
USER_FILE="User.json"
Task_FILE="Task.json"
SECRET_KEY="It's a secret Brother"
EMAIL="Your Email"
APP_PASSWORD="Your Pass"
def load_user():
    with open(USER_FILE,"r") as file:
        return json.load(file)

def load_task():
    with open(Task_FILE,"r") as file:
        return json.load(file)

def hash_password(password):

    hashed_password=pwd_context.hash(password)
    return hashed_password
@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    users = load_user()

    for user in users["all_users"]:
        if user["email"] == data["email"]:
            return jsonify({"Message": "User already exists"}), 409

    hashed_pw = hash_password(data["password"])
    new_user = {
        "Username": data["name"],
        "Password": hashed_pw,
        "email": data["email"]
    }
    id=datetime.now().strftime("%Y%m%d")+str(random.randint(0,999))
    users["all_users"].append(new_user)
    with open(USER_FILE, "w") as file:
        json.dump(users, file, indent=4)
    Tasks=load_task()
    Tasks[data["name"]]={
        "id":id,
        "email":data["email"],
        "Tasks":[]
    }
    with open(Task_FILE,"w") as file:
        json.dump(Tasks,file,indent=4)
    return jsonify({"Message": "Register success"}), 201



@app.route("/api/login",methods=["POST","GET"])
def login():
    data=request.get_json()
    print(data)
    users=load_user()
    for user in users["all_users"]:
        if user["email"] == data["Email"]:
            # Compare hashed password withc plaintext
            if pwd_context.verify(data["Password"], user["Password"]):
                payload={
                    "username":user["Username"],
                    "email":user["email"],
                    "exp":int((datetime.now(timezone.utc)+timedelta(minutes=30)).timestamp())
                }
                token=jwt.encode(payload,SECRET_KEY,algorithm="HS256")
                print(token)
                return jsonify({"Message": "Login Successfully","Access_Token":f"{token}"}), 201
            else:
                return jsonify({"Message": "Invalid Password"}), 401
    return jsonify({"Message":"Invalid User or Password"}),401


@app.route("/api/add_task",methods=["POST","GET"])
def add_task():
    data=request.get_json()
    task_data={
        "Task":data["Task"],
        "Date":data["Date"],
        "Describe":data["Describe"],
        "id":datetime.now().strftime("%Y%m%d")+str(random.randint(0,9999)),
        "emails":[]
    }
    print(data)
    auth_header=request.headers.get("Authorization")
    token=auth_header.split(" ")[1]
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms="HS256")
        Tasks=load_task()
        Tasks[payload["username"]]["Tasks"].append(task_data)
        with open(Task_FILE,"w") as file:
            json.dump(Tasks,file,indent=4)

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    return jsonify("df"),201
@app.route("/api/Get_all/task",methods=["POST","GET"])
def get_all_task():
    auth_header=request.headers.get("Authorization")
    token=auth_header.split(" ")[1]
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms="HS256")
        Tasks=load_task()
        if payload["username"]  not in Tasks:
            return jsonify({"Message":"User Invalid"}),401
        if payload["email"] != Tasks[payload["username"]]["email"]:
            return jsonify({"Message": "User Invalid"}), 401
        return jsonify({"Tasks":Tasks[payload["username"]]["Tasks"]}),201
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401

@app.route("/api/add_email",methods=["POST","GET"])
def add_email():
    auth_header = request.headers.get("Authorization")
    token = auth_header.split(" ")[1]
    data=request.get_json()
    print(data)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
        Tasks = load_task()
        if payload["username"] not in Tasks:
            return jsonify({"Message": "User Invalid"}), 401
        if payload["email"] != Tasks[payload["username"]]["email"]:
            return jsonify({"Message": "User Invalid"}), 401

        for task in Tasks[payload["username"]]["Tasks"]:
            for email in task["emails"]:
                if email==data["email"]:
                    return jsonify({"Message":"Email Exist"}),401

        Tasks[payload["username"]]["Tasks"][data["id"]]["emails"].append(data["email"])
        with open(Task_FILE, "w") as file:
            json.dump(Tasks, file, indent=4)
        return  jsonify({"Message":"Email is sent to user and it is added "}),201
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401

@app.route("/api/delete",methods=["POST","GET"])
def delete():
    data=request.get_json()
    id=data["id"]
    auth_header = request.headers.get("Authorization")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms="HS256")
        Tasks = load_task()
        if payload["username"] not in Tasks:
            return jsonify({"Message": "User Invalid"}), 401
        if payload["email"] != Tasks[payload["username"]]["email"]:
            return jsonify({"Message": "User Invalid"}), 401
        filtered_tasks = [task for task in Tasks[payload["username"]]["Tasks"]if task["id"] != id]
        if len(filtered_tasks) == len(Tasks[payload["username"]]["Tasks"]):
            return jsonify({"Message": "Task not found"}), 404
        Tasks[payload["username"]]["Tasks"]=filtered_tasks
        with open(Task_FILE,"w") as file:
            json.dump(Tasks,file,indent=4)
        return jsonify({"Message":"Task Deleted"}),201
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401

def send_emails():
    users=load_user()
    Tasks=load_task()
    for username, user_data in Tasks.items():
        second_email = user_data["email"]
        for task in user_data["Tasks"]:
            today = datetime.now().date()
            task_date = datetime.strptime(task["Date"], "%Y-%m-%d").date()
            if (task_date - today).days == 1:
                for email in task["emails"]:
                    with smtplib.SMTP("smtp.gmail.com", 587) as connection:
                        connection.starttls()
                        connection.login(EMAIL, APP_PASSWORD)
                        connection.sendmail(
                            from_addr=EMAIL,
                            to_addrs=email,
                            msg=f"""Subject: Expiry of Task {task["Task"]}\n\n\n
    
            This is a reminder that your project with {second_email} is due tomorrow.
            If completed, kindly remove it from the task list.
    
            Regards,  
            Team DevCircle
            """
                        )


if __name__ == "__main__":
    send_emails()
    app.run(debug=True)
