"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useTranslation } from "react-i18next";

function Combobox() {
  const { t } = useTranslation();

  const categorys = [
    {
      value: "all",
      label: t("all"),
    },
    {
      value: "technology",
      label: t("technology"),
    },
    {
      value: "life",
      label: t("life"),
    },
    {
      value: "art",
      label: t("art"),
    },
    {
      value: "poetry",
      label: t("poetry"),
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[100px] text-4xl h-auto py-3 rounded-full sm:text-6xl bg-background-light"
        >
          {value
            ? categorys.find((category) => category.value === value)?.label
            : t("all")}
          <ChevronsUpDown className="ml-2 h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 min-w-[var(--radix-popover-trigger-width)] max-h-60 overflow-y-auto">
        <Command>
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categorys.map((category) => (
                <CommandItem
                  key={category.value}
                  value={category.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="text-2xl sm:text-3xl py-4 px-3"
                >
                  {category.label}
                  <Check
                    className={cn(
                      "ml-auto h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12",
                      value === category.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
