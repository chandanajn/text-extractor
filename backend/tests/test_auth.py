from fastapi.testclient import TestClient


def test_register_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "name": "Test User",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data


def test_login_user(client: TestClient):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "password",
            "name": "Login User",
        },
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        data={"username": "login@example.com", "password": "password"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrong@example.com",
            "password": "password",
            "name": "Wrong User",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        data={"username": "wrong@example.com", "password": "wrongpassword"},
    )
    assert response.status_code == 400


def test_get_current_user(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "current@example.com",
            "password": "password",
            "name": "Current User",
        },
    )

    login_response = client.post(
        "/api/v1/auth/login",
        data={"username": "current@example.com", "password": "password"},
    )
    token = login_response.json()["access_token"]

    response = client.get(
        "/api/v1/users/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "current@example.com"
