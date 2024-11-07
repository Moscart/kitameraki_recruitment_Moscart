import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div>
      <header className="border-b">
        <div className="max-w-screen-xl mx-auto px-6 py-6">
          <Link to={"/"} className="font-bold text-lg">
            Task Management
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
