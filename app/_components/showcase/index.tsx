import { AccordionDemo } from "./accordion-demo";
import { ButtonDemo } from "./button-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { DialogDemo } from "./dialog-demo";
import { DropdownMenuDemo } from "./dropdown-menu-demo";
import { HeroDemo } from "./hero-demo";
import { NavigationDemo } from "./navigation-demo";
import { NotificationsDemo } from "./notifications-demo";
import { SwitchDemo } from "./switch-demo";
import { TabsDemo } from "./tabs-demo";

export function ShowcaseGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {/* Column 1 — activation sounds */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <ButtonDemo />
        <CheckboxDemo />
        <SwitchDemo />
      </div>

      {/* Column 2 — navigation sounds */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <TabsDemo />
        <NavigationDemo />
      </div>

      {/* Column 3 — notifications + hero */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <NotificationsDemo />
        <HeroDemo />
      </div>

      {/* Column 4 — system overlay components */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <DialogDemo />
        <AccordionDemo />
        <DropdownMenuDemo />
      </div>
    </div>
  );
}
