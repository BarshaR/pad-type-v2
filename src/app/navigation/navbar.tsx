import { ModeToggle } from "@/components/theme-toggle";
import { NavigationMenu } from "@/components/ui/navigation-menu";
// import Link from "next/link";
import { PadTypeLogo } from "../type-test/PadTypeLogo";

export default function Navbar() {
  return (
    // navbar is full width on the page
    <NavigationMenu className="max-w-full">
      <div className="flex items-center w-1/3">
        {/* <NavigationMenuList className="justify-between">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/type-test" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Type Test
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList> */}
      </div>
      <div className="flex items-center justify-center w-1/3">
        <PadTypeLogo />
      </div>
      <div className="flex justify-end w-1/3">
        <ModeToggle />
      </div>
    </NavigationMenu>
  );
}
