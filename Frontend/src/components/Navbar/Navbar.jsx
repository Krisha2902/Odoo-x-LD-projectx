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
     NAVBAR BACKGROUND

     HOME PAGE:
     Transparent at top so hero image stays visible.

     AFTER SCROLL:
     Glass background appears.

     OTHER PAGES:
     Theme-aware glass background.
  ===================================================== */

  const headerBackground =
    isHomePage && !scrolled
      ? "border-transparent bg-transparent shadow-none"
      : `
        border-b
        border-[#A7EBD9]/60
        bg-[#F4FFFC]/88
        shadow-[0_8px_35px_rgba(0,137,123,0.10)]
        dark:border-[#4ACFB2]/20
        dark:bg-[#071C1C]/90
        dark:shadow-[0_8px_35px_rgba(0,0,0,0.30)]
      `;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500",
        "backdrop-blur-xl",
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
            LOGO / BRAND
        ================================================= */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Ghummy Ghummi home"
        >
          <span
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-gradient-to-br
              from-[#8AF5D7]
              via-[#55E4C1]
              to-[#22C7B0]
              shadow-[0_0_25px_rgba(48,220,184,0.25)]
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:shadow-[0_0_35px_rgba(48,220,184,0.38)]
            "
          >
            <Compass
              className="h-6 w-6 text-[#063D3A]"
              strokeWidth={2.3}
            />
          </span>

          <span
            className="
              bg-gradient-to-r
              from-[#008F82]
              via-[#00A896]
              to-[#10B7A2]
              bg-clip-text
              text-[22px]
              font-semibold
              tracking-tight
              text-transparent
              dark:from-[#72F0D0]
              dark:via-[#5BE4C4]
              dark:to-[#8AF5D7]
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
                          bg-[#BDF6E6]/75
                          text-[#007C70]
                          shadow-[0_4px_16px_rgba(0,168,150,0.10)]

                          dark:bg-[#42D6B5]/15
                          dark:!text-[#D9FFF6]
                          dark:shadow-[0_4px_16px_rgba(66,214,181,0.10)]
                        `
                        : `
                          text-[#365F5C]
                          hover:bg-[#DDFBF2]/80
                          hover:text-[#007C70]

                          dark:!text-[#D9FFF6]
                          dark:hover:bg-[#42D6B5]/12
                          dark:hover:!text-[#FFFFFF]
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
                            ? `
                              text-[#009F8F]
                              dark:!text-[#8AF5D7]
                            `
                            : `
                              text-[#4C807A]
                              group-hover:text-[#00A896]

                              dark:!text-[#8AD8C8]
                              dark:group-hover:!text-[#A8FFE9]
                            `
                        )}
                        strokeWidth={1.8}
                      />

                      <span>{link.label}</span>

                      {/* ACTIVE PAGE INDICATOR */}

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
                            bg-[#23CDB0]
                            shadow-[0_0_9px_rgba(35,205,176,0.55)]
                            dark:bg-[#72F0D0]
                            dark:shadow-[0_0_10px_rgba(114,240,208,0.70)]
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
              border-[#A7EBD9]/70
              bg-white/45
              text-[#376B66]
              backdrop-blur-md
              transition-all
              duration-300

              hover:border-[#63DEC2]
              hover:bg-[#DDFBF2]/75
              hover:text-[#008F82]
              hover:shadow-[0_0_20px_rgba(0,168,150,0.14)]

              dark:border-[#5AD9BC]/25
              dark:bg-[#123131]/55
              dark:!text-[#C9F5EB]
              dark:hover:border-[#5AD9BC]/50
              dark:hover:bg-[#42D6B5]/12
              dark:hover:!text-[#8AF5D7]
              dark:hover:shadow-[0_0_20px_rgba(66,214,181,0.15)]
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
              from-[#7AF0D2]
              via-[#4DE0C1]
              to-[#20C9B0]
              px-6
              text-[15px]
              font-bold
              text-[#063D3A]
              shadow-[0_4px_18px_rgba(0,168,150,0.18)]
              transition-all
              duration-300

              hover:-translate-y-[1px]
              hover:shadow-[0_6px_24px_rgba(0,168,150,0.28)]
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
            border-[#A7EBD9]/70
            bg-white/45
            text-[#376B66]
            transition-all
            duration-300

            hover:border-[#63DEC2]
            hover:bg-[#DDFBF2]/75
            hover:text-[#008F82]

            dark:border-[#5AD9BC]/25
            dark:bg-[#123131]/55
            dark:!text-[#C9F5EB]
            dark:hover:border-[#5AD9BC]/50
            dark:hover:bg-[#42D6B5]/12
            dark:hover:!text-[#8AF5D7]

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
            bg-[#073D3A]/15
            backdrop-blur-sm
            dark:bg-black/45
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
            border-[#A7EBD9]/70

            bg-[#F4FFFC]/96

            shadow-2xl
            backdrop-blur-2xl

            transition-transform
            duration-400
            ease-out

            dark:border-[#5AD9BC]/20
            dark:bg-[#071C1C]/96

            lg:hidden
          `,
          mobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        )}
      >
        <div className="flex flex-col p-6">

          {/* MOBILE BRAND */}

          <div
            className="
              mb-6
              border-b
              border-[#A7EBD9]/60
              pb-6

              dark:border-[#5AD9BC]/20
            "
          >
            <span
              className="
                text-sm
                text-[#5B817C]
                dark:!text-[#A8D9CE]
              "
            >
              Explore the world
            </span>

            <h2
              className="
                mt-1
                text-xl
                font-semibold
                text-[#073D3A]
                dark:!text-[#E6FFF9]
              "
            >
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
                          ? `
                            bg-[#BDF6E6]/75
                            text-[#007C70]

                            dark:bg-[#42D6B5]/15
                            dark:!text-[#D9FFF6]
                          `
                          : `
                            text-[#365F5C]
                            hover:bg-[#DDFBF2]/80
                            hover:text-[#007C70]

                            dark:!text-[#D9FFF6]
                            dark:hover:bg-[#42D6B5]/12
                            dark:hover:!text-white
                          `
                      )
                    }
                  >
                    <Icon
                      className="
                        h-5
                        w-5
                        dark:!text-[#8AF5D7]
                      "
                    />

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
              from-[#7AF0D2]
              via-[#4DE0C1]
              to-[#20C9B0]

              font-bold
              text-[#063D3A]

              shadow-[0_4px_18px_rgba(0,168,150,0.18)]

              transition-all
              duration-300

              hover:shadow-[0_6px_22px_rgba(0,168,150,0.25)]
            "
          >
            <span>Plan a Trip</span>

            <ArrowUpRight
              className="h-4 w-4"
              strokeWidth={2.2}
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
              border-[#A7EBD9]/70

              bg-white/40

              px-4
              py-3.5

              text-[#376B66]

              transition-all

              hover:bg-[#DDFBF2]/75
              hover:text-[#008F82]

              dark:border-[#5AD9BC]/25
              dark:bg-[#123131]/55
              dark:!text-[#C9F5EB]
              dark:hover:bg-[#42D6B5]/12
              dark:hover:!text-[#8AF5D7]
            "
          >
            <UserRound className="h-5 w-5" />

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-[#073D3A]
                  dark:!text-[#E6FFF9]
                "
              >
                Your Profile
              </p>

              <p
                className="
                  text-xs
                  text-[#5B817C]
                  dark:!text-[#A8D9CE]
                "
              >
                Manage your account
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}