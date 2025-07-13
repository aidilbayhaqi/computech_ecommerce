import Image from "next/image";
import Section from "./components/section";
import DarkModeToggle from "./components/darkMode";
import Navbar from "./components/navbar";
import Card from "./components/card";
import SliderCarousel from "./components/slider";
import CategoryCard from "./components/CardCategories";
import SearchBar from "./components/Search";

export default function Home() {
  return (
   <>
   <div className="dark:bg-black dark:text-white bg-white text-black">
    <Section></Section>
    <SearchBar/>
    <SliderCarousel/>
    <CategoryCard/>
    <Card/>
   </div>
   
   </>
  );
}
