import { auth, signOut } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Admin Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Welcome, {session?.user?.email}
      </p>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700">
          Sign Out
        </button>
      </form>
    </div>
  );
}
