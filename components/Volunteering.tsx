"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { faList, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/supabase";

type Experience = Database["public"]["Tables"]["experience"]["Row"];

const VolunteeringCard = ({
  title,
  issuer,
  date,
  icon,
}: {
  title: string;
  issuer: string;
  date: string;
  icon: IconDefinition;
  certificate?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="border-1 border-border rounded-xl py-5 px-4 flex flex-col md:flex-row gap-4 items-start"
    >
      <div className="flex md:flex-row flex-row-reverse gap-4 items-start justofy-between w-full">
        <div className="w-5 h-5 md:mt-0 mt-auto">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="flex flex-col justify-between mr-auto">
          <span className="!m-0">{title}</span>
          <p className=" text-muted-foreground">{issuer}</p>
        </div>
      </div>
      <div className="text-muted-foreground/80 flex md:flex-col md:items-end justify-between flex-row w-full">
        <span>{date}</span>
      </div>
    </motion.div>
  );
};

const Volunteering = () => {
  const [volunteering, setVolunteering] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchVolunteering = async () => {
      const { data } = await supabase
        .from("experience")
        .select("*")
        .eq("type", "volunteering")
        .order("order_index", { ascending: true });

      if (data) {
        setVolunteering(data);
      }
    };
    fetchVolunteering();
  }, []);

  if (volunteering.length === 0) return null;

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-amber-800/10 rounded-full blur-3xl pointer-events-none " />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none " />

      <h1 className="mb-4 text-lg font-semibold">Volunteering</h1>
      <div className="space-y-4">
        {volunteering.map((item) => (
          <VolunteeringCard
            key={item.id}
            title={item.title}
            issuer={item.organization}
            date={`${new Date(item.start_date).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })} - ${
              item.end_date
                ? new Date(item.end_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })
                : "Present"
            }`}
            icon={faList}
          />
        ))}
      </div>
    </div>
  );
};

export default Volunteering;
