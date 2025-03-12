import axios from "axios";
import { HTTP_BACKEND } from "./config";
import { Content } from "next/font/google";

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
