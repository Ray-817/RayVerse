import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// 接收 value 和 onValueChange props
function Combobox({ value, onValueChange }) {
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
  // 内部状态 `value` 不再需要，因为它现在由外部 `props.value` 控制
  // 如果你需要 Combobox 内部的 `value` 来控制 UI 显示（例如 PopoverTrigger 的文本），
  // 那么它的初始值应该同步 props.value，并且只在用户选择时更新，
  // 但对于受控组件，通常直接使用 props.value。
  // 在你的原始代码中，`value` 状态用来控制 PopoverTrigger 的显示文本和 Check 图标。
  // 我们将它改用 `props.value` 来驱动。

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[100px] text-4xl h-auto py-3 rounded-full sm:text-6xl bg-background-light"
        >
          {/* 这里直接使用从父组件接收的 value prop */}
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
                    // 修正：直接调用父组件传递的 onValueChange
                    // 这里判断 currentValue === value ? "" : currentValue; 的逻辑
                    // 通常用于切换选中/未选中。
                    // 对于分类选择，一般是选中即覆盖。如果你希望可以取消选择，
                    // 可以保留这个三元表达式，并确保父组件能处理空值。
                    // 暂时我们假设它总是会有一个有效选择。
                    onValueChange(currentValue);
                    setOpen(false); // 关闭 Popover
                  }}
                  className="text-2xl sm:text-3xl py-4 px-3"
                >
                  {category.label}
                  <Check
                    className={cn(
                      "ml-auto h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 xl:h-12 xl:w-12",
                      // 这里也使用从父组件接收的 value prop
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
