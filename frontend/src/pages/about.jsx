
import '../style/App.css'
import Footer from '../components/Principal/Footer'
import Header from '../components/Principal/Header'
import WhoWeAre from '../components/Principal/WhoWeAre'

function App() {

  return (

    <div className='bg-base-200'>
      <Header />
      <WhoWeAre />
      <Footer />
    </div>
  )
}

export default App