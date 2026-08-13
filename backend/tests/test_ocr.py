from fastapi.testclient import TestClient

def get_auth_token(client: TestClient):
    client.post(
        "/api/v1/auth/register",
        json={"email": "ocr@example.com", "password": "password", "name": "OCR User"}
    )
    res = client.post(
        "/api/v1/auth/login",
        data={"username": "ocr@example.com", "password": "password"}
    )
    return res.json()["access_token"]

def test_get_history_empty(client: TestClient):
    token = get_auth_token(client)
    response = client.get(
        "/api/v1/ocr/history",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["data"] == []

def test_get_dashboard_stats(client: TestClient):
    token = get_auth_token(client)
    response = client.get(
        "/api/v1/dashboard/stats",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_uploads" in data
    assert "average_confidence" in data
