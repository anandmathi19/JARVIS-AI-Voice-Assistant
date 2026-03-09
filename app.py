from flask import Flask, render_template, jsonify
import os
from dotenv import load_dotenv
from livekit import api

load_dotenv()

app = Flask(__name__)

LIVEKIT_API_KEY = os.getenv("LIVEKIT_API_KEY")
LIVEKIT_API_SECRET = os.getenv("LIVEKIT_API_SECRET")
LIVEKIT_URL = os.getenv("LIVEKIT_URL")

ROOM_NAME = "jarvis-room"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/getToken")
def get_token():

    token = api.AccessToken(
        LIVEKIT_API_KEY,
        LIVEKIT_API_SECRET
    ).with_identity("anand-user").with_name("Anand")

    token = token.with_grants(
        api.VideoGrants(
            room_join=True,
            room=ROOM_NAME
        )
    )

    return jsonify({
        "token": token.to_jwt(),
        "url": LIVEKIT_URL
    })


if __name__ == "__main__":
    app.run(debug=True)