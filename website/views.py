from flask import Blueprint, request, render_template, redirect
import json
import os

views = Blueprint("views", __name__)
basedir = os.path.abspath(os.path.dirname(__file__))
# removed_file = "/data/spots_deleted.txt"
removed_file = os.path.join(basedir, 'static/data/spots_deleted.txt')
data_file = os.path.join(basedir, 'static/spots.json')


@views.route("/")
def show_spots():
    removed = []
    with open(removed_file) as file:
        for line in file:
            removed.append(line.rstrip())
    
    with open(data_file) as data:
        spots = data.read()
    return render_template("spots.html", spots = json.loads(spots), removed = removed)

@views.route("/delete-spot", methods=["POST"])
def delete_spot():
    req = json.loads(request.data)
    spot_id = req['spot_id']
    with open(removed_file, 'a') as file:
        file.write(f'{spot_id}\n')
    return ""

@views.route("/restore-spot", methods=["POST"])
def restore_spot():
    req = json.loads(request.data)
    spot_id = req['spot_id']
    with open(removed_file, "r") as f:
        lines = f.readlines()
    with open(removed_file, "w") as f:
        for line in lines:
            if line.strip("\n") != spot_id:
                f.write(line)
    return ""

@views.route("/reset-spots")
def reset_spots():
    open(removed_file, 'w').close()
    return redirect("/")

@views.route("/api/deleted", methods=["POST", "GET"])
def deleted():
    data = []
    with open(removed_file) as file:
        for line in file:
            data.append(line.rstrip())
    return data

@views.route("/api", methods=["POST", "GET"])
def api():
    with open(data_file) as data:
        return data.read()
    return ""