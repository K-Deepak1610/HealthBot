"""
HealthBot AI — Backend Test Suite
Run with: pytest tests/ -v
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ─── Health ──────────────────────────────────────────────────────────────────

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert "HealthBot" in res.json()["message"]


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


# ─── Authentication ───────────────────────────────────────────────────────────

TEST_USER = {
    "username": "testuser_pytest",
    "email": "pytest@healthbot.ai",
    "password": "Secure@1234",
    "role": "patient",
}


def test_register_user():
    res = client.post("/api/auth/register", json=TEST_USER)
    # 200 = newly created, 400 = already registered (both valid for idempotent test runs)
    assert res.status_code in (200, 400)
    if res.status_code == 200:
        data = res.json()
        assert "access_token" in data
        assert "refresh_token" in data


def test_login_user():
    # Register first (idempotent)
    client.post("/api/auth/register", json=TEST_USER)
    res = client.post(
        "/api/auth/login",
        data={"username": TEST_USER["username"], "password": TEST_USER["password"]},
    )
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_bad_password():
    res = client.post(
        "/api/auth/login",
        data={"username": TEST_USER["username"], "password": "WrongPass!999"},
    )
    assert res.status_code == 401


# ─── Medicine ────────────────────────────────────────────────────────────────

def test_list_medicines():
    res = client.get("/api/medicines")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_medicine_not_found():
    res = client.get("/api/medicines/xyzzy_fake_drug_12345")
    assert res.status_code == 404


# ─── Reminders ───────────────────────────────────────────────────────────────

def test_get_reminders_empty():
    res = client.get("/api/reminders")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_create_reminder():
    payload = {
        "title": "Paracetamol Test",
        "category": "medicine",
        "reminder_time": "08:00",
        "description": "Take with water",
    }
    res = client.post("/api/reminders", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["title"] == "Paracetamol Test"
    return data["id"]


def test_delete_reminder():
    # Create one to delete
    payload = {
        "title": "To Delete",
        "category": "water",
        "reminder_time": "09:00",
        "description": "",
    }
    create_res = client.post("/api/reminders", json=payload)
    rid = create_res.json()["id"]
    del_res = client.delete(f"/api/reminders/{rid}")
    assert del_res.status_code == 200


def test_delete_nonexistent_reminder():
    res = client.delete("/api/reminders/999999")
    assert res.status_code == 404


# ─── History ──────────────────────────────────────────────────────────────────

def test_get_history():
    res = client.get("/api/history")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)


def test_get_history_pagination():
    res = client.get("/api/history?page=1&limit=5")
    assert res.status_code == 200
    data = res.json()
    assert len(data["items"]) <= 5
