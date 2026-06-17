import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  BoxesIcon,
  Building2,
  ChevronRight,
  Home,
  Store,
  Workflow,
  Zap,
  type LucideIcon
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Box } from "./ui/box";
import { Separator } from "./ui/separator";

type SubNavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
};

type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: string | null;
  adminRoute?: boolean;
  children?: SubNavItem[];
};

const navItems: NavItem[] = [
  { to: "/", icon: Home, label: "Dashboard", badge: null },
  { to: "/company", icon: Building2, label: "Company" },
  { to: "/products", icon: BoxesIcon, label: "Products" },
  { to: "/stores", icon: Store, label: "Stores" },
  { to: "/shipping-plans", icon: Workflow, label: "Shipping Plans" },
];


const AppSidebar = ({
  setOpenSidebar,
}: {
  setOpenSidebar: (open: boolean) => void;
}) => {
  const { state } = useSidebar();
  const location = useLocation();
  const user = useAuthStore((s) => s.user)

  const isCollapsed = state === "collapsed";

  const isActive = (to: string) => {
    if (!to) return false;

    return to === "/"
      ? location.pathname === "/"
      : location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const isExactActive = (to: string) => {
    return location.pathname === to;
  };

  const isChildActive = (children?: SubNavItem[]) =>
    children?.some((child) => isExactActive(child.to)) ?? false;

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar
        collapsible="icon"
        onMouseEnter={() => setOpenSidebar(true)}
        onMouseLeave={() => setOpenSidebar(false)}
        className="border-r border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      >
        {/* Header / Logo */}
        <SidebarHeader className="px-3 py-4">
          <Box
            className={cn(
              "flex items-center gap-2.5 transition-all duration-200",
              isCollapsed ? "justify-center" : "px-1",
            )}
          >
            <Box className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </Box>
            {!isCollapsed && (
              <Box className="flex flex-col leading-none">
                <span className="font-semibold text-sm tracking-tight">
                  Gxpress
                </span>
              </Box>
            )}
          </Box>
        </SidebarHeader>

        <Separator className="mx-3 w-auto opacity-50" />

        {/* Navigation */}
        <SidebarContent className="px-2 py-3">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {navItems.map(
                  ({
                    to,
                    icon: Icon,
                    label,
                    badge,
                    adminRoute = false,
                    children,
                  }) => {
                    if (adminRoute && user?.role !== "admin") return null;

                    const active = isActive(to);
                    const childActive = isChildActive(children);
                    const hasChildren = !!children?.length;

                    // ── Item with sub-routes ───────────────────────────────
                    if (hasChildren) {
                      // Collapsed sidebar: icon with sub-link tooltip
                      if (isCollapsed) {
                        return (
                          <SidebarMenuItem key={to}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <SidebarMenuButton
                                  className={cn(
                                    "relative flex items-center justify-center h-10 rounded-lg transition-all duration-150 cursor-default",
                                    childActive
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                  )}
                                >
                                  <Icon className="h-5 w-5 shrink-0" />
                                </SidebarMenuButton>
                              </TooltipTrigger>
                              <TooltipContent
                                side="right"
                                className="p-0 min-w-36"
                              >
                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  {label}
                                </div>
                                <Separator />
                                <div className="py-1">
                                  {children.map(
                                    ({
                                      to: subTo,
                                      icon: SubIcon,
                                      label: subLabel,
                                    }) => (
                                      <Link
                                        key={subTo}
                                        to={subTo}
                                        className={cn(
                                          "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors",
                                          isActive(subTo)
                                            ? "bg-accent text-accent-foreground font-medium"
                                            : "hover:bg-accent hover:text-accent-foreground",
                                        )}
                                      >
                                        <SubIcon className="h-3.5 w-3.5 shrink-0" />
                                        {subLabel}
                                      </Link>
                                    ),
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </SidebarMenuItem>
                        );
                      }

                      // Expanded sidebar
                      return (
                        <Collapsible
                          key={to}
                          defaultOpen={childActive}
                          className="group/collapsible"
                          asChild
                        >
                          <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton
                                className={cn(
                                  "h-10 rounded-lg px-3 transition-all duration-150 w-full",
                                  childActive
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                <Icon className="h-5 w-5 shrink-0" />
                                <span className="flex-1 text-sm font-medium">
                                  {label}
                                </span>
                                <ChevronRight
                                  className={cn(
                                    "h-3.5 w-3.5 opacity-60 transition-transform duration-200",
                                    "group-data-[state=open]/collapsible:rotate-90",
                                  )}
                                />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>

                            <CollapsibleContent>
                              <SidebarMenuSub className="mt-1 ml-1 gap-0.5">
                                {children.map(
                                  ({
                                    to: subTo,
                                    icon: SubIcon,
                                    label: subLabel,
                                  }) => {
                                    const subActive = isExactActive(subTo);

                                    return (
                                      <SidebarMenuSubItem key={subTo}>
                                        <SidebarMenuButton
                                          asChild
                                          className={cn(
                                            "h-9 rounded-md px-3 transition-all duration-150",
                                            subActive
                                              ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-white"
                                              : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                          )}
                                        >
                                          <Link
                                            to={subTo}
                                            aria-current={
                                              subActive ? "page" : undefined
                                            }
                                            className="flex items-center gap-2.5"
                                          >
                                            <SubIcon className="h-4 w-4 shrink-0" />
                                            <span className="text-sm font-medium">
                                              {subLabel}
                                            </span>
                                          </Link>
                                        </SidebarMenuButton>
                                      </SidebarMenuSubItem>
                                    );
                                  },
                                )}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    // ── Regular flat item ─────────────────────────────────
                    return (
                      <SidebarMenuItem key={to}>
                        {isCollapsed ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <SidebarMenuButton
                                asChild
                                className={cn(
                                  "relative flex items-center justify-center h-10 rounded-lg transition-all duration-150",
                                  active
                                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )}
                              >
                                <Link
                                  to={to}
                                  aria-current={active ? "page" : undefined}
                                  className="flex items-center justify-center w-full h-full"
                                >
                                  <Icon className="h-5 w-5 shrink-0" />
                                  {badge && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground ring-1 ring-background">
                                      {badge}
                                    </span>
                                  )}
                                </Link>
                              </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              className="font-medium"
                            >
                              {label}
                              {badge && (
                                <Badge
                                  variant="secondary"
                                  className="ml-2 text-xs"
                                >
                                  {badge}
                                </Badge>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            className={cn(
                              "h-10 rounded-lg px-3 transition-all duration-150",
                              active
                                ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-secondary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            <Link
                              to={to}
                              aria-current={active ? "page" : undefined}
                              className="flex items-center gap-3"
                            >
                              <Icon className="h-5 w-5 shrink-0" />
                              <span className="flex-1 text-sm font-medium">
                                {label}
                              </span>
                              {badge && (
                                <Badge
                                  variant={active ? "outline" : "secondary"}
                                  className={cn(
                                    "h-5 min-w-5 px-1.5 text-[10px] font-semibold",
                                    active
                                      ? "border-primary-foreground/30 text-primary-foreground bg-primary-foreground/10"
                                      : "",
                                  )}
                                >
                                  {badge}
                                </Badge>
                              )}
                              {active && !badge && (
                                <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                              )}
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  },
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
};

export default AppSidebar;
