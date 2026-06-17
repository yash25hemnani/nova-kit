import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Box } from "./box";
import { Input } from "./input";
import { useState, useEffect } from "react";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  debounce?: number;
}

/**
 * A search bar component with debouncing functionality.
 * @param placeholder - The placeholder text for the search input.
 * @param value - The current value of the search input.
 * @param onChange - Callback function that is called when the search input changes, after the debounce delay.
 * @param className - Additional CSS classes to apply to the search bar container.
 * @param debounce - The debounce delay in milliseconds (default is 400ms).
 * @returns The rendered search bar component.
 */
const SearchBar = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
  debounce = 400,
}: SearchBarProps) => {
  const [input, setInput] = useState(value ?? "");

  useEffect(() => {
    const timer = setTimeout(() => onChange?.(input), debounce);
    return () => clearTimeout(timer);
  }, [input, debounce]);

  return (
    <Box className={cn("relative flex-1 max-w-sm", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="pl-9"
      />
    </Box>
  );
};

export default SearchBar;