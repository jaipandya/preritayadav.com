"use client";
import { useEffect } from "react";
import { sounds } from "@/lib/sounds";

export function SoundPreloader() {
  useEffect(() => {
    sounds.preloadAll();
  }, []);
  return null;
}
