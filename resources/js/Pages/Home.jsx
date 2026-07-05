import HeroSection from '@/Components/Modules/Home/HeroSection';
import NewArrivals from '@/Components/Modules/Home/NewArrivals';
import CategoryPreview from '@/Components/Modules/Home/CategoryPreview';
import AboutSection from '@/Components/Modules/Home/AboutSection';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

export default function Home({ newArrivals, categories }) {
    return (
        <>
            <Header />
            <HeroSection />
            <NewArrivals products={newArrivals} />
            <CategoryPreview categories={categories} />
            <AboutSection />
            <Footer />
        </>
    )
}