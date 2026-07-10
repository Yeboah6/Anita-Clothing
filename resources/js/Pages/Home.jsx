import HeroSection from '@/Components/Modules/Home/HeroSection';
import NewArrivals from '@/Components/Modules/Home/NewArrivals';
import CategoryPreview from '@/Components/Modules/Home/CategoryPreview';
import AboutSection from '@/Components/Modules/Home/AboutSection';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

export default function Home({ newArrivals, categories }) {
    return (
        <>
        <div className="fixed top-0 left-0 w-full h-16 bg-black z-50 shadow-md">
            <Header />
            <HeroSection />
            <NewArrivals products={newArrivals} />
            <CategoryPreview categories={categories} />
            <AboutSection />
            <Footer />
        </div>
        </>
    )
}