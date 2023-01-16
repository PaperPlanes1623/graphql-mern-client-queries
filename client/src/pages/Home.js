import Clients from '../components/Clients'
import AddClientModal from "../components/addClientModal";
import Projects from "../components/Projects";

export default function Home() {
  return (
    <>
        <div className='d-flex mb-4 gap-3'>
            <AddClientModal />
        </div>
        <Projects />
        <hr/>
        <Clients /> 
    </>
  )
}
