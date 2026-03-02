"use client";
import { useState, useCallback } from "react";
import { sounds } from "./sounds";

export function useSoundEnabled(): [boolean, () => void] {
  const [enabled, setEnabled] = useState<boolean>(() => sounds.enabled);
  const toggle = useCallback(() => setEnabled(sounds.toggle()), []);
  return [enabled, toggle];
}
