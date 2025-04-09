import axios from "axios";
import { HTTP_BACKEND } from "./config";
import { Content } from "next/font/google";
import { headers } from "next/headers";

export async function getExistingShapes(roomId: string) {
  const response = await axios.get(`${HTTP_BACKEND}/shapes/${roomId}`);
  const elements = response.data.elements;

  const elementData = elements.map((element) => {
    return { ...element.data, type: element.type, roomId, roomAction: "draw" };
  });

  return elementData;
}

export async function signUp(
  fullName: string,
  email: string,
  password: string,
) {
  const response = await axios.post(`${HTTP_BACKEND}/signup`, {
    fullName,
    email,
    password,
  });

  return response;
}

export async function login(email: string, password: string) {
  const response = await axios.post(`${HTTP_BACKEND}/login`, {
    email,
    password,
  });

  console.log(response.data.token);

  document.cookie = `auth-token=${response.data.token}; path=/;`;

  window.localStorage.setItem("token", response.data.token);
  return response;
}

export async function getRooms() {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];

  const response = await axios.get(`${HTTP_BACKEND}/rooms`, {
    headers: { Authorization: token },
  });

  return response.data;
}

export async function addRoom(slug: string) {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth-token="))
    ?.split("=")[1];

  const response = axios.post(
    `${HTTP_BACKEND}/room`,
    {
      slug: slug,
    },
    { headers: { Authorization: token } },
  );

  return response;
}

export async function deleteBoard(id: number) {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1];

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await axios.delete(`${HTTP_BACKEND}/room/${id}`, {
      headers: { Authorization: token },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to delete board:", error);
    throw error;
  }
}
