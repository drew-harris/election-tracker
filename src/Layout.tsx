import Link from "next/link";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

const links: { href: string; label: string }[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/summary",
    label: "Summary",
  },
  {
    href: "/schedule",
    label: "Schedule",
  },
];

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  return (
    <div className="m-4">
      <div className="flex justify-center gap-20 overflow-x-scroll border-b pb-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href}>
            <div
              style={{
                color: router.pathname === l.href ? "red" : "black",
              }}
            >
              {l.label}
            </div>
          </Link>
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}
