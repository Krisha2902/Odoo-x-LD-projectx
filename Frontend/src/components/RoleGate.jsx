import React from "react";

export default function RoleGate({ userRole = "owner", allowedRoles = ["owner", "conductor", "editor"], fallback = null, children }) {
  const isAllowed = allowedRoles.includes(userRole.toLowerCase());

  if (!isAllowed) {
    return fallback || (
      <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-bold text-center">
        🔒 View-Only Mode (Requires &lsquo;{allowedRoles.join(" or ")}&rsquo; role to edit)
      </div>
    );
  }

  return <>{children}</>;
}
