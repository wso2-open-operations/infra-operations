import { createContext } from "react";
import { ThemeMode } from "@utils/types"; // adjust import path as needed

interface ColorModeContextType {
  mode: ThemeMode;
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: ThemeMode.Light,
  toggleColorMode: () => {},
});
