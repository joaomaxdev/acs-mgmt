import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Home, LayoutDashboard, LogOut, Package, PanelBottom, Settings, Settings2, ShoppingBag, Users, Wifi } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export function Sidebar() {
 return (
   <div className="flex w-full flex-col bg-muted/40">

    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Link href="#"
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
          >
            <LayoutDashboard className="h-4" />
            <span className="sr-only">Dashboard do sistema</span>
          </Link>

          <Tooltip>
            <TooltipTrigger>
              <Link href="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="#"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Wifi className="h-5 w-5" />
            <span className="sr-only">Devices</span>
          </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Devices</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="#"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Users className="h-5 w-5" />
            <span className="sr-only">Clientes</span>
          </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Clientes</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Link href="#"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Configurações</TooltipContent>
          </Tooltip>


        </TooltipProvider>
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link href="#"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sair</span>
          </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header 
        className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelBottom className="w-5 h-5" />
                <span className="sr-only">abrir / fechar menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-x">
              <nav className="grid gap-6 text-lg font-medium m-3">
                <Link 
                href="#"
                className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-2"
                prefetch={false}
                >
                  <Package className="h-5 w-5 transition-all" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link 
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                >
                  <Home className="h-5 w-5 transition-all" />
                  Início
                </Link>

                <Link 
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                >
                  <ShoppingBag className="h-5 w-5 transition-all" />
                  Pedidos
                </Link>

                <Link 
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                >
                  <Package className="h-5 w-5 transition-all" />
                  Produtos
                </Link>

                <Link 
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                >
                  <Users className="h-5 w-5 transition-all" />
                  Clientes
                </Link>

                <Link 
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
                >
                  <Settings2 className="h-5 w-5 transition-all" />
                  Configurações
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <h2>Menu</h2>
        </header>
      </div>
   </div>
 );
}