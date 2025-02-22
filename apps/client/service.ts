import axios from "axios";
import { HTTP_BACKEND } from "./config";

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

  window.localStorage.setItem("token", response.data.token);
  return response;
}
