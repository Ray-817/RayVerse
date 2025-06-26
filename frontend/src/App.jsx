import { AlertProvider } from "@context/AlertContext";

import "./index.css";
import Navbar from "@components/layout/Navbar";
import Hero from "@components/sections/Hero";
import TechnicalStack from "@components/sections/TechnicalStack";
import WhyMe from "@components/sections/WhyMe";
import MyTakes from "@components/sections/MyTakes";
import HobbiesGallery from "@components/sections/HobbiesGallery";
import Contact from "@components/sections/Contact";
import Footer from "@components/layout/Footer";
import i18n from "./i18n";
import { I18nextProvider } from "react-i18next";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
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
    </I18nextProvider>
  );
}

export default App;
