
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, CalendarDays, Info, Home, PlayCircle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/bs-to-ad', label: 'BS to AD', icon: CalendarDays },
  { href: '/ad-to-bs', label: 'AD to BS', icon: CalendarDays },
  { href: '/api-info', label: 'API Info', icon: Info },
  { href: '/api-playground', label: 'API Playground', icon: PlayCircle },
];

export default function AppHeader() {
  return (
    <header className="bg-card border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CalendarDays className="h-7 w-7 text-primary" />
          <span className="text-2xl font-bold font-headline text-foreground">NepaliDate</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navItems.map((item) => (
            <Button key={item.label} variant="ghost" asChild size="sm">
              <Link href={item.href} className="flex items-center gap-1.5 text-sm">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="border-b pb-4 mb-4 text-left">
                <SheetTitle className="flex items-center gap-2 text-xl">
                  <CalendarDays className="h-6 w-6 text-primary" />
                  NepaliDate Menu
                </SheetTitle>
                <SheetDescription>
                  Navigate through the application sections.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Button key={item.label} variant="ghost" className="justify-start text-base h-12" asChild>
                     <Link href={item.href} className="flex items-center gap-2.5">
                       <item.icon className="h-5 w-5" />
                       {item.label}
                     </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

