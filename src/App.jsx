
import Gallery from './Gallery'
import Hero from './Hero'
import './index.css'
// import Story from './Story'
import Videos from './Videos'

function App() {


  return (
    <>
      <section className='bg-gradient-to-tr from-[#1F2A3E] via-[#3A424D] to-[#EFE1BE] '>
        <Hero/>
        <Gallery />
        {/* <Story /> */}
        <Videos />
      </section>
    </>
  )
}

export default App
