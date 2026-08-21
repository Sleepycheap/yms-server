import Button from "../../ui/Button"

function CreateTruck() {
  return (
    <div className="grid grid-rows-5 grid-cols-3 gap-5 my-5">
      <h1 className="row-start-1 col-start-2 text-center text-2xl self-center border-b-2 border-stone-500">Create Truck</h1>
      <div className="grid grid-rows-3 grid-cols-1 col-start-2 row-start-2 row-span-3 justify-self-center items-center justify-evenly">
        <div className="flex w-120 justify-evenly">
          <label for='scac-code' className="text-2xl">SCAC Code</label>
          <select className="text-center appearance-none bg-gray-50 w-45 relative left-2"></select> 
        </div>
        <div className="row-start-2 flex justify-evenly w-120">
          <label for='trailer-number' className="text-2xl">Trailer Number</label>
          <input type='text' name='trailer-number' id='trailer-number' className="bg-gray-50 relative right-1" />
        </div>
        <div className="row-start-3 flex justify-evenly w-120">
          <label for='date' className="text-2xl">Date</label>
          <input type='date' className=" appearance-none bg-gray-50 w-45 relative left-8"></input>
        </div>
      </div>
      <button type='submit' className="row-start-5 col-start-2 inline-block text-sm rounded-full bg-blue-500 font-semibold uppercase tracking-wide text-stone-100 transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed px-4 py-3 sm:px-6 sm:py-4">Create Truck</button>
    </div>

  )
}

export default CreateTruck
