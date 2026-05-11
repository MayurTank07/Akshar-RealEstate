import Navbar from "../components/Navbar";
import Properties from "../components/Properties";
import Footer from "../components/Footer";

export default function PropertiesPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-24">
        <Properties />
      </main>
      <Footer />
    </div>
  );
}
