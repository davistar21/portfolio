import { Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";
import { SectionErrorBoundary } from "@/components/SectionErrorBoundary";
import ScrollProgressBar from "@/components/about/ScrollProgressBar";
import SectionEyebrow from "@/components/about/SectionEyebrow";
import AboutHero from "@/components/about/AboutHero";
import AboutMe from "@/components/about/AboutMe";
import TechnicalSkills from "@/components/about/TechnicalSkills";
import WorkExperience from "@/components/WorkExperience";
import Volunteering from "@/components/Volunteering";
import Achievements from "@/components/Achievements";
import { Skeleton } from "@/components/ui/skeleton";

type Bio = Database["public"]["Tables"]["bio"]["Row"];
type Experience = Database["public"]["Tables"]["experience"]["Row"];

export const metadata = {
  title: "About",
  description:
    "A longer look at Eyitayo's work, the tools, and the milestones along the way.",
};

export const revalidate = 60;

async function AboutMeSection() {
  const { data, error } = await supabase
    .from("bio")
    .select("*")
    .maybeSingle();
  if (error) console.error("Bio fetch error:", error);
  return <AboutMe bio={(data as Bio | null) ?? null} />;
}

async function WorkSection() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("type", "job")
    .order("order_index", { ascending: true });
  if (error) console.error("Work fetch error:", error);
  const items = (data as Experience[] | null) ?? [];
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="work-heading">
      <h2 id="work-heading" className="sr-only">
        Work Experience
      </h2>
      <SectionEyebrow index="03" label="Work" />
      <WorkExperience initialData={items} />
    </section>
  );
}

async function VolunteeringSection() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("type", "volunteering")
    .order("order_index", { ascending: true });
  if (error) console.error("Volunteering fetch error:", error);
  const items = (data as Experience[] | null) ?? [];
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="volunteering-heading">
      <h2 id="volunteering-heading" className="sr-only">
        Volunteering
      </h2>
      <SectionEyebrow index="04" label="Volunteering" />
      <Volunteering initialData={items} />
    </section>
  );
}

async function AchievementsSection() {
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .eq("type", "achievement")
    .order("order_index", { ascending: true });
  if (error) console.error("Achievements fetch error:", error);
  const items = (data as Experience[] | null) ?? [];
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="achievements-heading">
      <h2 id="achievements-heading" className="sr-only">
        Achievements
      </h2>
      <SectionEyebrow index="05" label="Achievements" />
      <Achievements initialData={items} />
    </section>
  );
}

function SectionFallback() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-40" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <ScrollProgressBar />
      <article className="mx-auto max-w-3xl px-4 md:px-8 pt-24 pb-32 flex flex-col gap-24 md:gap-28">
        <AboutHero />

        <SectionErrorBoundary name="About Me">
          <Suspense fallback={<SectionFallback />}>
            <AboutMeSection />
          </Suspense>
        </SectionErrorBoundary>

        <TechnicalSkills />

        <SectionErrorBoundary name="Work Experience">
          <Suspense fallback={<SectionFallback />}>
            <WorkSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Volunteering">
          <Suspense fallback={<SectionFallback />}>
            <VolunteeringSection />
          </Suspense>
        </SectionErrorBoundary>

        <SectionErrorBoundary name="Achievements">
          <Suspense fallback={<SectionFallback />}>
            <AchievementsSection />
          </Suspense>
        </SectionErrorBoundary>
      </article>
    </>
  );
}
