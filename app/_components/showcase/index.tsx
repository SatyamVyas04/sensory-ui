import { AccordionDemo } from "./accordion-demo";
import { ButtonDemo } from "./button-demo";
import { CarouselDemo } from "./carousel-demo";
import { CheckboxDemo } from "./checkbox-demo";
import { DialogDemo } from "./dialog-demo";
import { HeroDemo } from "./hero-demo";
import { NavigationDemo } from "./navigation-demo";
import { NotificationsDemo } from "./notifications-demo";
import { RadioGroupDemo } from "./radio-group-demo";
import { SelectDemo } from "./select-demo";
import { SliderDemo } from "./slider-demo";
import { SwitchDemo } from "./switch-demo";
import { TabsDemo } from "./tabs-demo";
import { ToggleDemo } from "./toggle-demo";

export function ShowcaseGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
      {/* Column 1 — activation: clicks, toggles, state changes */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <ButtonDemo />
        <RadioGroupDemo />
        <CheckboxDemo />
        <SwitchDemo />
      </div>

      {/* Column 2 — navigation: direction, selection, spatial movement */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <TabsDemo />
        <CarouselDemo />
        <ToggleDemo />
        <SliderDemo />
      </div>

      {/* Column 3 — system: open/close overlays, expand/collapse */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <DialogDemo />
        <AccordionDemo />
        <SelectDemo />
      </div>

      {/* Column 4 — feedback: notifications and hero moments */}
      <div className="flex flex-col gap-4 *:w-full *:max-w-full">
        <NotificationsDemo />
        <HeroDemo />
        <NavigationDemo />
      </div>
    </div>
  );
}
