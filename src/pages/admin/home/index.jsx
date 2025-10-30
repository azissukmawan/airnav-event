import Navbaru from "../../../components/navbaru";
import Sidebar from "../../../components/sidebar";

const Home = () => {
  return (
    <>
    <div className="bg-gray-100">
    <div className="">
      {/* <div>
        <h1>Home</h1>
      </div> */}
      {/* <div>
        <Sidebar/>
      </div> */}

      <div>
        {/* <Sidebar role="admin"/> */}
        <Navbaru/>
      </div>
    </div>
    </div>
   </>
  );
};

export default Home;