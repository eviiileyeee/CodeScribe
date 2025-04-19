import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
import Link from "next/link"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

const Header = () => {
    return (
        <header>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <img
                            src="https://tse3.mm.bing.net/th?id=OIP.1fwIPS0UPPDwO84HRxoiBwHaHa&pid=Api&P=0&h=180"
                            className="h-8 w-6"
                            alt="CodeScribe AI Logo"
                        />
                        <span className="text-xl font-bold">
                            <span className="text-primary">Code</span>
                            Scribe AI
                        </span>
                    </Link>

                    {/* Navigation Menu */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-4">
                            {navigation.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <Link href={item.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                                        {item.name}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
        </header>
    )
}

export default Header;
