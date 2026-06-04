import Navbar from '@/components/navbar';
import Hero3D from '@/components/hero-3d';
import FeaturedProducts from '@/components/featured-products';
import WhyUs from '@/components/why-us';
import AboutSection from '@/components/about-section';
import ProductsSection from '@/components/products-section';
import Footer from '@/components/footer';
import BulkOrderForm from '@/components/bulk-order-form';

export default function Page() {
  return (
    <main className="w-full overflow-hidden bg-transparent">
      <Navbar />
      <Hero3D />
      <FeaturedProducts />
      <WhyUs />
      <AboutSection />
      <ProductsSection />
      <BulkOrderForm />
      <Footer />
    </main>
  );
}