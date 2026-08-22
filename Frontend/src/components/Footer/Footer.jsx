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
        border-[#5AD9BC]/20
        bg-[#061A1A]
        text-[#A8D9CE]
      "
    >
      {/* DECORATIVE BACKGROUND */}
      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-80
          w-80
          rounded-full
          bg-[#42D6B5]/5
          blur-3xl
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
          bg-[#20C9B0]/5
          blur-3xl
        "
      />

      {/* MAIN FOOTER CONTENT */}
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
          {/* BRAND SECTION */}
          <div className="max-w-md text-left">
            <Link
              to="/"
              className="group inline-flex items-center gap-3.5"
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

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#8FBEB5]">
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
                shadow-[0_4px_18px_rgba(0,168,150,0.3)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[0_6px_24px_rgba(0,168,150,0.4)]
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

          {/* QUICK LINKS */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#E6FFF9]">
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
                        text-[#8FBEB5]
                        hover:translate-x-1
                        hover:text-[#72F0D0]
                      "
                    >
                      <Icon
                        className="
                          h-4
                          w-4
                          transition-colors
                          duration-300
                          text-[#72CDBB]
                          group-hover:text-[#72F0D0]
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

          {/* ACCOUNT */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#E6FFF9]">
              Your Journey
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/profile"
                  className="group inline-flex items-center gap-2.5 text-sm text-[#8FBEB5] hover:translate-x-1 hover:text-[#72F0D0] transition-all"
                >
                  <UserRound className="h-4 w-4 text-[#72CDBB] group-hover:text-[#72F0D0]" strokeWidth={1.8} />
                  Your Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/my-trips"
                  className="group inline-flex items-center gap-2.5 text-sm text-[#8FBEB5] hover:translate-x-1 hover:text-[#72F0D0] transition-all"
                >
                  <Plane className="h-4 w-4 text-[#72CDBB] group-hover:text-[#72F0D0]" strokeWidth={1.8} />
                  My Trips
                </Link>
              </li>

              <li>
                <Link
                  to="/ongoing-trips"
                  className="group inline-flex items-center gap-2.5 text-sm text-[#8FBEB5] hover:translate-x-1 hover:text-[#72F0D0] transition-all"
                >
                  <Sparkles className="h-4 w-4 text-[#72CDBB] group-hover:text-[#72F0D0]" strokeWidth={1.8} />
                  Ongoing Trips
                </Link>
              </li>

              <li>
                <Link
                  to="/calendar"
                  className="group inline-flex items-center gap-2.5 text-sm text-[#8FBEB5] hover:translate-x-1 hover:text-[#72F0D0] transition-all"
                >
                  <CalendarDays className="h-4 w-4 text-[#72CDBB] group-hover:text-[#72F0D0]" strokeWidth={1.8} />
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="text-left">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#E6FFF9]">
              Get in Touch
            </h3>

            <div className="mt-5 space-y-4">
              <a
                href="tel:+919974154676"
                className="group flex items-start gap-3 text-sm text-[#8FBEB5] hover:text-[#72F0D0] transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#5AD9BC]/20 bg-[#123131]/60">
                  <Phone className="h-4 w-4 text-[#72F0D0]" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-xs text-[#719F97]">Call us</p>
                  <p className="mt-0.5 font-medium">+91 99741 54676</p>
                </div>
              </a>

              <a
                href="mailto:GummyGummi@gmail.com"
                className="group flex items-start gap-3 text-sm text-[#8FBEB5] hover:text-[#72F0D0] transition-colors"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#5AD9BC]/20 bg-[#123131]/60">
                  <Mail className="h-4 w-4 text-[#72F0D0]" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-[#719F97]">Email us</p>
                  <p className="mt-0.5 break-all font-medium">GummyGummi@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-10 h-px w-full bg-[#5AD9BC]/15" />

        {/* BOTTOM BAR */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#719F97]">
            © {new Date().getFullYear()} Ghummy Ghummi. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/privacy"
              className="text-xs text-[#719F97] hover:text-[#72F0D0] transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-[#719F97] hover:text-[#72F0D0] transition-colors"
            >
              Terms &amp; Conditions
            </Link>

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
                border-[#5AD9BC]/20
                bg-[#123131]/60
                text-[#8AD8C8]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#5AD9BC]/45
                hover:bg-[#42D6B5]/10
                hover:text-[#8AF5D7]
              "
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}