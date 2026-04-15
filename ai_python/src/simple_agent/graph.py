"""Minimal LangChain agent graph for deployment."""

from __future__ import annotations

import ast
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from typing import Any

from langchain.agents import create_agent
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

load_dotenv()

# DEFAULT_MODEL = os.getenv("SIMPLE_AGENT_MODEL", "anthropic:claude-sonnet-4-6")
modelName = os.getenv("MODEL_NAME")
modelBaseURL = os.getenv("OPENAI_BASE_URL")
modelApiKey = os.getenv("API_KEY")

model = ChatOpenAI(model=modelName, base_url=modelBaseURL, api_key=modelApiKey)


@tool
def utc_now() -> str:
    """Return the current UTC timestamp in ISO format."""
    return datetime.now(tz=timezone.utc).isoformat()


@tool
def calculator(expression: str) -> str:
    """Evaluate a simple arithmetic expression safely.

    Supported operators: +, -, *, /, %, ** and parentheses.
    """
    parsed = ast.parse(expression, mode="eval")
    allowed_nodes = (
        ast.Expression,
        ast.BinOp,
        ast.UnaryOp,
        ast.Constant,
        ast.Add,
        ast.Sub,
        ast.Mult,
        ast.Div,
        ast.Mod,
        ast.Pow,
        ast.USub,
        ast.UAdd,
        ast.Load,
    )

    for node in ast.walk(parsed):
        if not isinstance(node, allowed_nodes):
            raise ValueError("Expression contains unsupported syntax")

    result: Any = eval(
        compile(parsed, "<calculator>", "eval"), {"__builtins__": {}}, {}
    )
    return str(result)


testToken = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ims1VE9fTHBkX2NKWVVlcHhwTjdsbiJ9.eyJodHRwczovL3NtYXJ0Y2FtcHVzLmFwaS9yb2xlcyI6WyJBRE1JTiJdLCJodHRwczovL3NtYXJ0Y2FtcHVzLmFwaS9lbWFpbCI6ImFkbWluLnRlc3RAZ21haWwuY29tIiwiaHR0cHM6Ly9zbWFydGNhbXB1cy5hcGkvbmFtZSI6ImFkbWluLnRlc3RAZ21haWwuY29tIiwiaXNzIjoiaHR0cHM6Ly9kZXYtNGNpa3czc3VlMHZ3c2x5MC51cy5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjljMjI2OGJiYmNiZDVkY2M4YzVhMDRhIiwiYXVkIjpbImh0dHBzOi8vc21hcnRjYW1wdXMuYXBpIiwiaHR0cHM6Ly9kZXYtNGNpa3czc3VlMHZ3c2x5MC51cy5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNzc2MjkwNjgxLCJleHAiOjE3NzYzNzcwODEsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhenAiOiJRUmcxNWtac1ZHS29VNVBmNDJhbjRlSW5CeTRSMlpuMCJ9.UnJaOrd92cM5CV_ipdZkdRhesj7b6xNxj1qnVLMxyyH5ppKBr43frlTTPrFvRjkOs7GscE_SZ1YjTHGbEtTsGgxIcQxcmhxjMeE4IwH--tltyJJERBX1fNsG9nusOBZ9hIgMrbNvsBkPzcrStJ7zX-onoS5RLBsJSsKwYpe4aj7RR43YRQNdqsCy1OtoEFWGty4gLhQTMKolPB27YvPr5L6EMPLm7f3SJYCo6_3hVkad7T0PiTp64aQWBoAn3_laFq1L2q_iS0ADyVzi_F7VptCKOC_Bl6RPrnp2BKcUGtNI8_atOoS3p60i4iFgrdNxS_bI9zKctWMqJSNzT1YBGg"


@tool
def campusResources():
    """
    Fetches a list of available campus resources (Labs, Rooms, Equipment, .etc).

    Use this tool when the user wants to browse resources, check availability,
    or find a specific location for their needs.

    Returns:
        list: A list of resource objects if successful, or a string error message if the fetch fails.
    """
    import requests
    import json

    base_url = os.getenv("BACKEND_API_URL")
    url = f"{base_url}/api/resources"

    headers = {
        "Authorization": testToken,
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code == 200:
            data = response.json()
            itemList = []
            for item in data["data"]["items"]:
                formattedItem = {
                    "id": item["id"],
                    "name": item["name"],
                    "type": item["type"],
                    "capacity": item["capacity"],
                    "location": item["location"],
                    "status": item["status"],
                }
                itemList.append(formattedItem)
            # return itemList
            return json.dumps(itemList)

    except Exception as e:
        return f"Error accessing campus resources: {str(e)}"


graph = create_agent(
    model=model,
    tools=[utc_now, calculator,campusResources],
    system_prompt=(
        "You are a concise assistant. "
        "Use tools when they add factual precision, then return a direct answer."
    ),
    name="simple_agent",
)
