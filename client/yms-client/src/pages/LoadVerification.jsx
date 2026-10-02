import { useNavigate } from "react-router-dom"
import styles from './LoadVerification.module.css'
import logo from '../assets/Logo.svg'

function LoadVerification() {
  const navigate = useNavigate()

  function handleBack() {
    navigate(-1)
  }

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className="row-span-3 row-start-1 flex">
          <img src={logo} className="w-60" />
        </div>
        <div className="col-start-2 col-span-6 border border-slate-900 flex justify-center items-center">
          <h1 className="text-2xl font-bold ">BlueScope Buildings North America - Load Verification</h1>
        </div>
        <div className="col-start-2 row-start 2 flex justify-start items-center text-2xl font-bold border border-slate-900">
          <p>Document No.</p>
        </div>
        <div className="col-start-3 row-start-2 flex justify-start items-center font-bold border border-slate-900  text-2xl">
          <p>FMMF1002</p>
        </div>
        <div className="col-start-2 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>Issued:</p>
        </div>
        <div className="col-start-3 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>09/09/2015</p>
        </div>
        <div className="col-start-4 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>Revision: </p>
        </div>
        <div className="col-start-5 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>3</p>
        </div>
        <div className="col-start-6 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>Revised:</p>
        </div>
        <div className="col-start-7 row-start-3 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>01/04/2016</p>
        </div>  
      </div>

      <div className={styles.content}>
        <div className={styles.content_header}>
          <div className="col-start-1 row-start-1 flex justify-start items-center font-bold border border-slate-900 text-2xl">
          <p>Loader Name(s):</p>
        </div>
        <div className="col-start-2 row-start-1 flex justify-start items-center font-bold border border-slate-900 text-2xl">
        <p>Anthony Vauthier</p>
        </div>  
        </div>
      </div>
    </div>
  )
}

export default LoadVerification
