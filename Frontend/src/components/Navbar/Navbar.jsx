import { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Compass,
  Map,
  Plane,
  Sparkles,
  CalendarDays,
  UserRound,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../../utils/cn";

const NAV_LINKS = [
  {
    label: "Home",
    to: "/",
    icon: Compass,
  },
  {
    label: "Explore",
    to: "/explore",
    icon: Map,
  },
  {
    label: "My Trips",
    to: "/my-trips",
    icon: Plane,
  },
  {
    label: "Ongoing Trips",
    to: "/ongoing-trips",
    icon: Sparkles,
  },
  {
    label: "Calendar",
    to: "/calendar",
    icon: CalendarDays,
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const headerBackground =
    isHomePage && !scrolled
      ? "border-transparent bg-transparent shadow-none"
      : `
        border-b
        border-[#5AD9BC]/20
        bg-[#071C1C]/92
        shadow-[0_8px_35px_rgba(0,0,0,0.50)]
      `;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        "backdrop-blur-2xl",
        headerBackground
      )}
    >
      <nav
        className="
          mx-auto
          flex
          h-[72px]
          max-w-[1400px]
          items-center
          justify-between
          px-6
          lg:px-10
          xl:px-14
        "
      >
        {/* =================================================
            BRAND LOGO (EXISTING TWIN G MONOGRAM + JET AIRPLANE)
        ================================================= */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3.5"
          aria-label="Ghummy Ghummi home"
        >
          <div className="relative flex items-center justify-center">
            <div className="flex items-center justify-center font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform">
              <span className="text-white">G</span>
              <span className="text-[#72F0D0] inline-block rotate-180 -ml-0.5">G</span>
            </div>
            <svg
              className="w-4 h-4 text-[#72F0D0] absolute -top-1.5 -right-2.5 rotate-45 drop-shadow-[0_0_8px_rgba(114,240,208,0.8)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
          </div>

          <div className="flex items-baseline tracking-tight leading-none font-black text-xl">
            <span className="text-white">G</span>
            <span className="font-extrabold text-sm text-[#72F0D0] mr-0.5">hummy</span>
            <span className="inline-block rotate-180 text-white">G</span>
            <span className="font-extrabold text-sm text-[#72F0D0]">hummi</span>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION (DARK THEME ACCENTS)
        ================================================= */}

        <ul className="hidden items-center gap-2 lg:flex">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;

            return (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      `
                        group
                        relative
                        flex
                        items-center
                        gap-2
                        rounded-full
                        px-4
                        py-2.5
                        text-[15px]
                        font-medium
                        transition-all
                        duration-300
                      `,
                      isActive
                        ? `
                          bg-[#42D6B5]/20
                          text-[#D9FFF6]
                          border
                          border-[#42D6B5]/40
                          shadow-[0_0_15px_rgba(66,214,181,0.20)]
                        `
                        : `
                          text-zinc-300
                          hover:bg-[#42D6B5]/12
                          hover:text-white
                        `
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          "h-[17px] w-[17px] transition-all duration-300",
                          isActive
                            ? "text-[#72F0D0]"
                            : "text-[#8AD8C8] group-hover:text-[#A8FFE9]"
                        )}
                        strokeWidth={1.8}
                      />

                      <span>{link.label}</span>

                      {isActive && (
                        <span
                          className="
                            absolute
                            -bottom-[5px]
                            left-1/2
                            h-[2px]
                            w-8
                            -translate-x-1/2
                            rounded-full
                            bg-[#72F0D0]
                            shadow-[0_0_10px_rgba(114,240,208,0.80)]
                          "
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* =================================================
            RIGHT SIDE CONTROLS
        ================================================= */}

        <div className="hidden items-center gap-4 lg:flex">
          {/* PROFILE */}

          <Link
            to="/profile"
            aria-label="Profile"
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-[#5AD9BC]/25
              bg-[#123131]/60
              text-[#C9F5EB]
              backdrop-blur-md
              transition-all
              duration-300

              hover:border-[#5AD9BC]/50
              hover:bg-[#42D6B5]/20
              hover:text-[#8AF5D7]
              hover:shadow-[0_0_20px_rgba(66,214,181,0.2)]
            "
          >
            <UserRound
              className="h-[19px] w-[19px]"
              strokeWidth={1.7}
            />
          </Link>

          {/* PLAN A TRIP CTA */}

          <Link
            to="/plan-trip"
            className="
              group
              flex
              h-11
              items-center
              gap-2
              rounded-full
              bg-gradient-to-r
              from-[#7AF0D2]
              via-[#4DE0C1]
              to-[#20C9B0]
              px-6
              text-[15px]
              font-bold
              text-[#063D3A]
              shadow-[0_4px_18px_rgba(0,168,150,0.3)]
              transition-all
              duration-300

              hover:-translate-y-[1px]
              hover:shadow-[0_6px_24px_rgba(0,168,150,0.4)]
            "
          >
            <span>Plan a Trip</span>

            <ArrowUpRight
              className="
                h-[17px]
                w-[17px]
                transition-transform
                duration-300
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
              strokeWidth={2.2}
            />
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            border
            border-[#5AD9BC]/25
            bg-[#123131]/60
            text-[#C9F5EB]
            transition-all
            duration-300

            hover:border-[#5AD9BC]/50
            hover:bg-[#42D6B5]/20
            hover:text-[#8AF5D7]

            lg:hidden
          "
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* MOBILE BACKDROP */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            top-[72px]
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* MOBILE MENU */}

      <div
        className={cn(
          `
            fixed
            right-0
            top-[72px]
            z-50
            h-[calc(100vh-72px)]
            w-full
            max-w-sm

            border-l
            border-[#5AD9BC]/20

            bg-[#071C1C]/98

            shadow-2xl
            backdrop-blur-2xl

            transition-transform
            duration-400
            ease-out

            lg:hidden
          `,
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6">
          <div className="mb-6 border-b border-[#5AD9BC]/20 pb-6">
            <span className="text-sm text-[#A8D9CE]">Explore the world</span>
            <h2 className="mt-1 text-xl font-semibold text-[#E6FFF9]">
              Ghummy Ghummi
            </h2>
          </div>

          <ul className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        `
                          flex
                          items-center
                          gap-3
                          rounded-2xl
                          px-4
                          py-3.5
                          text-[15px]
                          font-medium
                          transition-all
                          duration-300
                        `,
                        isActive
                          ? `
                            bg-[#42D6B5]/20
                            text-[#D9FFF6]
                            border
                            border-[#42D6B5]/30
                          `
                          : `
                            text-zinc-300
                            hover:bg-[#42D6B5]/12
                            hover:text-white
                          `
                      )
                    }
                  >
                    <Icon className="h-5 w-5 text-[#8AF5D7]" />
                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          <Link
            to="/plan-trip"
            className="
              mt-6
              flex
              h-12
              items-center
              justify-center
              gap-2
              rounded-full

              bg-gradient-to-r
              from-[#7AF0D2]
              via-[#4DE0C1]
              to-[#20C9B0]

              font-bold
              text-[#063D3A]

              shadow-[0_4px_18px_rgba(0,168,150,0.3)]
              transition-all
            "
          >
            <span>Plan a Trip</span>
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>

          <Link
            to="/profile"
            className="
              mt-3
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-[#5AD9BC]/25
              bg-[#123131]/60
              px-4
              py-3.5
              text-[#C9F5EB]
              transition-all
              hover:bg-[#42D6B5]/15
              hover:text-[#8AF5D7]
            "
          >
            <UserRound className="h-5 w-5" />
            <div>
              <p className="text-sm font-medium text-[#E6FFF9]">Your Profile</p>
              <p className="text-xs text-[#A8D9CE]">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}