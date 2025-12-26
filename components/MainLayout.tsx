"use client";

import { usePathname } from "next/navigation";
import { CustomToaster } from "./CustomToaster";
import Footer from "./Footer";
import Header from "./Header";
import Providers from "./Providers";
import ScrollToTop from "./ScrollToTop";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  return (
    <Providers>
      <div className="md:w-[768px] w-full px-2 mx-auto">
        {!isAdminRoute && <Header />}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none " />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none " />
        <main className="py-10 ">{children}</main>
        {!isAdminRoute && <Footer />}
      </div>
      <ScrollToTop />
      <CustomToaster />
    </Providers>
  );
};
export default MainLayout;
