import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { CafeteriaArt, ItArt, LibraryArt, TeachingArt } from "@/components/illustrations";

type Office = {
  name: string;
  dept: string;
  items: string;
  Art: (p: { className?: string }) => React.ReactElement;
  photo?: string; // optional: "/images/cafeteria.jpg" (put the file in public/images)
};

// To use a real photo, add:  photo: "/images/cafeteria.jpg"
const offices: Office[] = [
  { name: "Cafeteria", dept: "Cafeteria Administration", items: "Food quality, prices, variety, staff", Art: CafeteriaArt },
  { name: "Library", dept: "Library Administration", items: "Books, seating, hours, librarian", Art: LibraryArt },
  { name: "Labs and IT", dept: "Laboratory / IT Administration", items: "Computers, internet, projectors, software", Art: ItArt },
  { name: "Teaching", dept: "Academic Administration", items: "Late lectures, notes, explanations", Art: TeachingArt },
];

export function OfficeCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {offices.map((o, i) => (
        <Reveal key={o.name} delay={i * 80}>
          <Link
            href="/register"
            className="group block h-full overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* Fixed 4:3 box, so the layout never jumps while the image loads */}
            <div className="relative aspect-[4/3] overflow-hidden">
              {o.photo ? (
                <Image
                  src={o.photo}
                  alt={`${o.name} area on campus`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              ) : (
                <o.Art className="h-full w-full transition duration-500 group-hover:scale-110" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{o.name}</h3>
              <p className="text-xs font-medium text-primary">{o.dept}</p>
              <p className="mt-1 text-sm text-muted-foreground">{o.items}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Report an issue
                <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}