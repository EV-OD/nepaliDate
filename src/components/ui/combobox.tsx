
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "./scroll-area"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  popoverClassName?: string
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyText = "No option found.",
  className,
  popoverClassName,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className, disabled && "opacity-50 cursor-not-allowed")}
          disabled={disabled}
        >
          {value
            ? options.find((option) => option.value === value)?.label ?? placeholder
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0", popoverClassName)}>
        <Command
          filter={(itemValue, search) => {
            // itemValue is the CommandItem's 'value' prop (option.value)
            // search is the CommandInput's current text
            const trimmedSearch = search.trim().toLowerCase();
            if (trimmedSearch === "") return 1; // Show all if search is empty
            
            // Perform a case-insensitive "starts with" search on the item's value
            if (itemValue.toLowerCase().startsWith(trimmedSearch)) return 1;
            
            return 0; // Hide if it doesn't start with the search term
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <ScrollArea className="h-auto max-h-60">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value} // This is what the filter function receives as `itemValue`
                  onSelect={(currentValue) => {
                    // currentValue is option.value from the selected CommandItem
                    const selectedOption = options.find(opt => opt.value.toLowerCase() === currentValue.toLowerCase());
                    if (selectedOption) {
                        onChange(selectedOption.value === value ? "" : selectedOption.value);
                    } else if (currentValue === "" && value !== "") { 
                        onChange("");
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

