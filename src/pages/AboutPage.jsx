import AboutHero from '../components/AboutPage/AboutHero.jsx'
import AboutMetrics from '../components/AboutPage/AboutMetrics.jsx'
import AboutStory from '../components/AboutPage/AboutStory.jsx'
import AboutFounder from '../components/AboutPage/AboutFounder.jsx'
import AboutValues from '../components/AboutPage/Gallery.jsx'
import AboutRoadmap from '../components/AboutPage/AboutRoadmap.jsx'
import AboutCta from '../components/AboutPage/AboutCta.jsx'

export default function AboutPage() {
  return (
    <div className="bg-[#edfcfe]">
      <AboutHero />
      <AboutStory />
      <AboutFounder />
      <AboutMetrics />
      <AboutRoadmap />
      <AboutValues />
      <AboutCta />
    </div>
  )
}
