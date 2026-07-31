import SEO from '@/Components/SEO';
import HeroSection from '@/Components/Modules/Home/HeroSection';
import NewArrivals from '@/Components/Modules/Home/NewArrivals';
import CategoryPreview from '@/Components/Modules/Home/CategoryPreview';
import AboutSection from '@/Components/Modules/Home/AboutSection';
import ReviewsSection from '@/Components/Modules/Home/ReviewsSection';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

export default function Home({ newArrivals, categories, collections, reviews, reviewStats }) {
    return (
        <>
            <SEO
                title=" Affordable Fits for The Girlies"
                description="Hi bloomer🌸✨ <br /> Welcome to your new favorite world.."
                url="/"
            />
            <div>

            <Header />
            <HeroSection />
            <NewArrivals products={newArrivals} />
            <CategoryPreview categories={categories} />
            <AboutSection collections={collections} />
            <ReviewsSection reviews={reviews} stats={reviewStats} />
            <Footer />
            </div>
        </>
    );
}