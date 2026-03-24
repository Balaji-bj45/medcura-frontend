import CareHero from '../components/CarePage/CareHero.jsx'
import CareApproach from '../components/CarePage/CareApproach.jsx'
import CareServices from '../components/CarePage/CareServices.jsx'
import CareStandards from '../components/CarePage/CareStandards.jsx'
import CareCta from '../components/CarePage/CareCta.jsx'

export default function CarePage() {
  return (
    <div className="bg-[#edfcfe]">
      <CareHero />
      <CareApproach />
      <CareServices />
      <CareStandards />
      <CareCta />
    </div>
  )
}
