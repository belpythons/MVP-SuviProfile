import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    LogOut,
    ChevronRight,
} from "lucide-react";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/login");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
                {/* Logo */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold">
                        <span className="text-purple-400">Suvi</span> Admin
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Command Center</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink href="/admin/dashboard" icon={LayoutDashboard}>
                        Dashboard
                    </NavLink>
                    <NavLink href="/admin/courses" icon={BookOpen}>
                        Courses
                    </NavLink>
                    <NavLink href="/admin/leads" icon={Users}>
                        Leads
                    </NavLink>
                </nav>

                {/* User Info & Logout */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                            {session.user.name?.charAt(0) || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>
                    <form
                        action={async () => {
                            "use server";
                            await signOut({ redirectTo: "/auth/login" });
                        }}
                    >
                        <button
                            type="submit"
                            className="
                w-full flex items-center gap-2 px-4 py-2.5 rounded-lg
                text-gray-400 hover:text-white hover:bg-gray-800
                transition-colors
              "
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64">
                <div className="p-8">{children}</div>
            </main>
        </div>
    );
}

// Navigation Link Component
function NavLink({
    href,
    icon: Icon,
    children,
}: {
    href: string;
    icon: React.ElementType;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="
        flex items-center gap-3 px-4 py-3 rounded-lg
        text-gray-400 hover:text-white hover:bg-gray-800
        transition-colors group
      "
        >
            <Icon className="w-5 h-5" />
            <span className="flex-1">{children}</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    );
}
