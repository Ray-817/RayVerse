import "../../index.css";
import Navbar from "@components/layout/Navbar";
import Hero from "@components/sections/Hero";
import TechnicalStack from "@components/sections/TechnicalStack";
import WhyMe from "@components/sections/WhyMe";
import MyTakes from "@components/sections/MyTakes";
import HobbiesGallery from "@components/sections/HobbiesGallery";
import Contact from "@components/sections/Contact";
import Footer from "@components/layout/Footer";
import { AlertProvider } from "@context/AlertContext";

export { Page };

function Page() {
  return (
    <AlertProvider>
      <Navbar />
      <Hero />
      <TechnicalStack />
      <WhyMe />
      <MyTakes />
      <HobbiesGallery />
      <Contact />
      <Footer />
    </AlertProvider>
  );
}
