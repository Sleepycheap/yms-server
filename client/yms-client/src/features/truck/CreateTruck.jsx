import Button from "../../ui/Button"

function CreateTruck() {
  return (
    <div id='ct-main' className="grid grid-rows-5 grid-cols-3 gap-5 my-5 h-90">
      <h1 id='ct-header' className="row-start-1 col-start-2 text-center text-2xl self-center border-b-2 border-stone-500">Create Truck</h1>
      <div id='ct-options' className="grid grid-rows-3 grid-cols-1 col-start-2 row-start-2 row-span-3 justify-self-center items-center justify-evenly w-100 sm:w-120">
        <div id='ct-scac-select' className="flex sm:w-120 justify-evenly">
          <label for='scac-code' className="text-2xl">SCAC Code</label>
          <select className="text-center appearance-none bg-gray-50 w-45 relative left-2"></select> 
        </div>
        <div id='ct-tn' className="row-start-2 flex justify-evenly sm:w-120">
          <label for='trailer-number' className="text-2xl">Trailer Number</label>
          <input type='text' name='trailer-number' id='trailer-number' className="bg-gray-50 relative right-1" />
        </div>
        <div id='ct-date' className="row-start-3 flex justify-evenly sm:w-120">
          <label for='date' className="text-2xl">Date</label>
          <input type='date' className=" appearance-none bg-gray-50 w-45 relative left-8"></input>
        </div>
      </div>
        <div className="row-start-5 col-start-2">
      <Button type='primary' >Create Truck</Button>
        </div>
    </div>

  )
}

export default CreateTruck
