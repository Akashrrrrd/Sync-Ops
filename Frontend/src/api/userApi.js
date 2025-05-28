// Update this in your frontend src/api/userApi.js
const API_BASE_URL = "http://localhost:3000/api"; // Change to your backend URL

export async function getUserData(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${uid}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function setUserData(uid, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${uid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to save user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
}