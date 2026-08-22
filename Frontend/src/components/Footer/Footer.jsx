import { Link } from "react-router-dom";
import {
  Compass,
  Map,
  Plane,
  Sparkles,
  CalendarDays,
  UserRound,
  ArrowUpRight,
  Mail,
  Phone,
  ArrowUp,
} from "lucide-react";
import { cn } from "../../utils/cn";

const FOOTER_LINKS = [
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
  {
    label: "Profile",
    to: "/profile",
    icon: UserRound,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-[#A7EBD9]/70
        bg-[#F4FFFC]
        text-[#365F5C]

        dark:border-[#5AD9BC]/20
        dark:bg-[#061A1A]
        dark:text-[#A8D9CE]
      "
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-[#62E8C8]/10
          blur-3xl

          dark:bg-[#42D6B5]/5
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-32
          h-96
          w-96
          rounded-full
          bg-[#4DE0C1]/10
          blur-3xl

          dark:bg-[#20C9B0]/5
        "
      />

      {/* =====================================================
          MAIN FOOTER CONTENT
      ===================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-[1400px]
          px-6
          py-14

          sm:py-16
          lg:px-10
          lg:py-20
          xl:px-14
        "
      >
        <div
          className="
            grid
            grid-cols-1
            gap-12

            md:grid-cols-2
            md:gap-10

            lg:grid-cols-[1.5fr_1fr_1.2fr_1.2fr]
            lg:gap-12
          "
        >
          {/* =================================================
              BRAND SECTION
          ================================================= */}

          <div className="max-w-md">
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
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
                  shadow-[0_0_25px_rgba(48,220,184,0.20)]
                  transition-all
                  duration-300

                  group-hover:scale-105
                  group-hover:shadow-[0_0_35px_rgba(48,220,184,0.35)]
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

            <p
              className="
                mt-5
                max-w-sm
                text-sm
                leading-7
                text-[#5B817C]

                dark:text-[#8FBEB5]
              "
            >
              Discover new places, plan unforgettable journeys, and
              keep every adventure beautifully organized in one place.
            </p>

            {/* PLAN A TRIP CTA */}

            <Link
              to="/plan-trip"
              className="
                group
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-gradient-to-r
                from-[#7AF0D2]
                via-[#4DE0C1]
                to-[#20C9B0]
                px-5
                py-2.5
                text-sm
                font-bold
                !text-[#063D3A]
                shadow-[0_4px_18px_rgba(0,168,150,0.15)]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:shadow-[0_6px_24px_rgba(0,168,150,0.25)]
              "
            >
              <span>Plan a Trip</span>

              <ArrowUpRight
                className="
                  h-4
                  w-4
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
              QUICK LINKS
          ================================================= */}

          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#073D3A]

                dark:text-[#E6FFF9]
              "
            >
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {FOOTER_LINKS.slice(0, 5).map((link) => {
                const Icon = link.icon;

                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="
                        group
                        inline-flex
                        items-center
                        gap-2.5
                        text-sm
                        transition-all
                        duration-300

                        text-[#5B817C]
                        hover:translate-x-1
                        hover:text-[#008F82]

                        dark:text-[#8FBEB5]
                        dark:hover:text-[#72F0D0]
                      "
                    >
                      <Icon
                        className="
                          h-4
                          w-4
                          transition-colors
                          duration-300

                          text-[#6AA49C]
                          group-hover:text-[#00A896]

                          dark:text-[#72CDBB]
                          dark:group-hover:text-[#72F0D0]
                        "
                        strokeWidth={1.8}
                      />

                      <span>{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* =================================================
              ACCOUNT
          ================================================= */}

          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#073D3A]

                dark:text-[#E6FFF9]
              "
            >
              Your Journey
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    text-sm
                    transition-all
                    duration-300

                    text-[#5B817C]
                    hover:translate-x-1
                    hover:text-[#008F82]

                    dark:text-[#8FBEB5]
                    dark:hover:text-[#72F0D0]
                  "
                >
                  <UserRound
                    className="
                      h-4
                      w-4
                      text-[#6AA49C]
                      transition-colors
                      group-hover:text-[#00A896]

                      dark:text-[#72CDBB]
                      dark:group-hover:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />

                  Your Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/my-trips"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    text-sm
                    transition-all
                    duration-300

                    text-[#5B817C]
                    hover:translate-x-1
                    hover:text-[#008F82]

                    dark:text-[#8FBEB5]
                    dark:hover:text-[#72F0D0]
                  "
                >
                  <Plane
                    className="
                      h-4
                      w-4
                      text-[#6AA49C]
                      transition-colors
                      group-hover:text-[#00A896]

                      dark:text-[#72CDBB]
                      dark:group-hover:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />

                  My Trips
                </Link>
              </li>

              <li>
                <Link
                  to="/ongoing-trips"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    text-sm
                    transition-all
                    duration-300

                    text-[#5B817C]
                    hover:translate-x-1
                    hover:text-[#008F82]

                    dark:text-[#8FBEB5]
                    dark:hover:text-[#72F0D0]
                  "
                >
                  <Sparkles
                    className="
                      h-4
                      w-4
                      text-[#6AA49C]
                      transition-colors
                      group-hover:text-[#00A896]

                      dark:text-[#72CDBB]
                      dark:group-hover:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />

                  Ongoing Trips
                </Link>
              </li>

              <li>
                <Link
                  to="/calendar"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-2.5
                    text-sm
                    transition-all
                    duration-300

                    text-[#5B817C]
                    hover:translate-x-1
                    hover:text-[#008F82]

                    dark:text-[#8FBEB5]
                    dark:hover:text-[#72F0D0]
                  "
                >
                  <CalendarDays
                    className="
                      h-4
                      w-4
                      text-[#6AA49C]
                      transition-colors
                      group-hover:text-[#00A896]

                      dark:text-[#72CDBB]
                      dark:group-hover:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />

                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================= */}

          <div>
            <h3
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#073D3A]

                dark:text-[#E6FFF9]
              "
            >
              Get in Touch
            </h3>

            <div className="mt-5 space-y-4">
              {/* PHONE */}

              <a
                href="tel:+919974154676"
                className="
                  group
                  flex
                  items-start
                  gap-3
                  text-sm
                  transition-colors
                  duration-300

                  text-[#5B817C]
                  hover:text-[#008F82]

                  dark:text-[#8FBEB5]
                  dark:hover:text-[#72F0D0]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#A7EBD9]/60
                    bg-white/60

                    dark:border-[#5AD9BC]/20
                    dark:bg-[#123131]/60
                  "
                >
                  <Phone
                    className="
                      h-4
                      w-4
                      text-[#00A896]

                      dark:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p
                    className="
                      text-xs
                      text-[#71938E]

                      dark:text-[#719F97]
                    "
                  >
                    Call us
                  </p>

                  <p className="mt-0.5 font-medium">
                    +91 99741 54676
                  </p>
                </div>
              </a>

              {/* EMAIL */}

              <a
                href="mailto:GummyGummi@gmail.com"
                className="
                  group
                  flex
                  items-start
                  gap-3
                  text-sm
                  transition-colors
                  duration-300

                  text-[#5B817C]
                  hover:text-[#008F82]

                  dark:text-[#8FBEB5]
                  dark:hover:text-[#72F0D0]
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#A7EBD9]/60
                    bg-white/60

                    dark:border-[#5AD9BC]/20
                    dark:bg-[#123131]/60
                  "
                >
                  <Mail
                    className="
                      h-4
                      w-4
                      text-[#00A896]

                      dark:text-[#72F0D0]
                    "
                    strokeWidth={1.8}
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className="
                      text-xs
                      text-[#71938E]

                      dark:text-[#719F97]
                    "
                  >
                    Email us
                  </p>

                  <p className="mt-0.5 break-all font-medium">
                    GummyGummi@gmail.com
                  </p>
                </div>
              </a>
            </div>

            
          </div>
        </div>

        {/* =====================================================
            DIVIDER
        ===================================================== */}

        <div
          className="
            my-10
            h-px
            w-full
            bg-[#A7EBD9]/60

            dark:bg-[#5AD9BC]/15
          "
        />

        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5

            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <p
            className="
              text-xs
              leading-5
              text-[#71938E]

              dark:text-[#719F97]
            "
          >
            © {new Date().getFullYear()} Ghummy Ghummi. All rights reserved.
          </p>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
            "
          >
            <Link
              to="/privacy"
              className="
                text-xs
                text-[#71938E]
                transition-colors
                hover:text-[#008F82]

                dark:text-[#719F97]
                dark:hover:text-[#72F0D0]
              "
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="
                text-xs
                text-[#71938E]
                transition-colors
                hover:text-[#008F82]

                dark:text-[#719F97]
                dark:hover:text-[#72F0D0]
              "
            >
              Terms & Conditions
            </Link>

            {/* BACK TO TOP */}

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-[#A7EBD9]/60
                bg-white/50
                text-[#4C807A]
                transition-all
                duration-300

                hover:-translate-y-0.5
                hover:border-[#63DEC2]
                hover:bg-[#DDFBF2]
                hover:text-[#008F82]

                dark:border-[#5AD9BC]/20
                dark:bg-[#123131]/60
                dark:text-[#8AD8C8]
                dark:hover:border-[#5AD9BC]/45
                dark:hover:bg-[#42D6B5]/10
                dark:hover:text-[#8AF5D7]
              "
            >
              <ArrowUp
                className="h-4 w-4"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}