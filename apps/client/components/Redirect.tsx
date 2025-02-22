"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function AuthCheck() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  }, []);

  return null;
}
