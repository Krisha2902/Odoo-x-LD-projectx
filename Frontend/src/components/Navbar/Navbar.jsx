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

  /* =====================================================
     SCROLL DETECTION
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =====================================================
     CLOSE MOBILE MENU WHEN ROUTE CHANGES
  ===================================================== */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* =====================================================
     PREVENT BACKGROUND SCROLL WHEN MOBILE MENU IS OPEN
  ===================================================== */

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* =====================================================
     HOMEPAGE NAVBAR BEHAVIOUR
  ===================================================== */

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        isHomePage && !scrolled
          ? "border-transparent bg-transparent"
          : "border-b border-white/10 bg-[#071517]/75 shadow-[0_8px_35px_rgba(0,0,0,0.18)] backdrop-blur-xl"
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
            LOGO / BRAND
        ================================================= */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Ghummy Ghummi home"
        >
          {/* TEMPORARY LOGO */}

          <span
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-cyan-300
              via-teal-400
              to-sky-400
              shadow-[0_0_25px_rgba(45,212,191,0.28)]
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:shadow-[0_0_35px_rgba(45,212,191,0.4)]
            "
          >
            <Compass
              className="h-6 w-6 text-[#062024]"
              strokeWidth={2.3}
            />
          </span>

          <span
            className="
              bg-gradient-to-r
              from-cyan-200
              via-teal-300
              to-sky-300
              bg-clip-text
              text-[22px]
              font-semibold
              tracking-tight
              text-transparent
            "
          >
            Ghummy Ghummi
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
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
                          bg-white/[0.07]
                          text-cyan-200
                          `
                        : `
                          text-white/60
                          hover:bg-white/[0.05]
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
                            ? "text-cyan-300"
                            : "text-white/50 group-hover:text-cyan-300"
                        )}
                        strokeWidth={1.8}
                      />

                      <span>{link.label}</span>

                      {/* =================================================
                          ACTIVE PAGE INDICATOR
                          DOT CHANGED TO SHORT LINE
                      ================================================= */}

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
                            bg-cyan-300
                            shadow-[0_0_8px_rgba(103,232,249,0.5)]
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
            RIGHT SIDE
        ================================================= */}

        <div className="hidden items-center gap-4 lg:flex">
          {/* PROFILE */}

          <Link
            to="/profile"
            aria-label="Profile"
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              text-white/70
              backdrop-blur-md
              transition-all
              duration-300
              hover:border-cyan-300/30
              hover:bg-cyan-300/10
              hover:text-cyan-200
              hover:shadow-[0_0_20px_rgba(45,212,191,0.12)]
            "
          >
            <UserRound
              className="h-[19px] w-[19px]"
              strokeWidth={1.7}
            />
          </Link>

          {/* =================================================
              PLAN A TRIP CTA
          ================================================= */}

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
              from-cyan-300
              to-sky-400
              px-6
              text-[15px]
              font-bold
              shadow-[0_4px_18px_rgba(34,211,238,0.12)]
              transition-all
              duration-300
              hover:-translate-y-[1px]
              hover:shadow-[0_6px_22px_rgba(34,211,238,0.18)]
            "
            style={{
              color: "#062024",
            }}
          >
            <span
              style={{
                color: "#062024",
              }}
            >
              Plan a Trip
            </span>

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
              style={{
                color: "#062024",
              }}
            />
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

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
            border-white/10
            bg-white/[0.04]
            text-white/80
            transition-all
            duration-300
            hover:border-cyan-300/30
            hover:bg-cyan-300/10
            hover:text-cyan-200
            lg:hidden
          "
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* ===================================================
          MOBILE BACKDROP
      =================================================== */}

      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            top-[72px]
            z-40
            bg-black/40
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===================================================
          MOBILE MENU
      =================================================== */}

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
          border-white/10
          bg-[#071517]/95
          shadow-2xl
          backdrop-blur-2xl
          transition-transform
          duration-400
          ease-out
          lg:hidden
          `,
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6">
          {/* MOBILE BRAND */}

          <div className="mb-6 border-b border-white/10 pb-6">
            <span className="text-sm text-white/40">
              Explore the world
            </span>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Ghummy Ghummi
            </h2>
          </div>

          {/* MOBILE LINKS */}

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
                          ? "bg-cyan-300/10 text-cyan-200"
                          : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />

                    {link.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>

          {/* MOBILE CTA */}

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
              from-cyan-300
              to-sky-400
              font-bold
              shadow-[0_4px_18px_rgba(34,211,238,0.1)]
              transition-all
              duration-300
              hover:shadow-[0_6px_22px_rgba(34,211,238,0.16)]
            "
            style={{
              color: "#062024",
            }}
          >
            <span
              style={{
                color: "#062024",
              }}
            >
              Plan a Trip
            </span>

            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={2.2}
              style={{
                color: "#062024",
              }}
            />
          </Link>

          {/* PROFILE */}

          <Link
            to="/profile"
            className="
              mt-3
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-white/10
              px-4
              py-3.5
              text-white/60
              transition-all
              hover:bg-white/[0.05]
              hover:text-white
            "
          >
            <UserRound className="h-5 w-5" />

            <div>
              <p className="text-sm font-medium text-white">
                Your Profile
              </p>

              <p className="text-xs text-white/40">
                Manage your account
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}