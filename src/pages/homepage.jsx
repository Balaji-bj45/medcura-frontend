import Hero from '../components/Homepage/Hero.jsx'
import WhyChooseMedCura from '../components/Homepage/WhyChooseMedCura.jsx'
import ShopByCategory from '../components/Homepage/ShopByCategory.jsx'
import BestSellingEquipment from '../components/Homepage/BestSellingEquipment.jsx'
import HealthcareSolutions from '../components/Homepage/HealthcareSolutions.jsx'
import NeedHelpChoosing from '../components/Homepage/NeedHelpChoosing.jsx'
import Testimonials from '../components/Homepage/Testimonials.jsx'
import YouTubeShorts from '../components/Homepage/YouTubeShorts.jsx'

function HomePage() {
  return (
    <div>
      <Hero />
      <ShopByCategory />
      <BestSellingEquipment />
      <HealthcareSolutions />
      <WhyChooseMedCura />
      <Testimonials/>
      <YouTubeShorts />
      <NeedHelpChoosing />
    </div>
  )
}

export default HomePage
