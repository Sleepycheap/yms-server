import styles from './Modal.module.css'
import { cloneElement, createContext, useContext, useState } from 'react'
import Button from './Button'
import {createPortal} from 'react-dom'



const ModalContext = createContext()


function Modal({children}) {
  const [openName, setOpenName] = useState('');

  const close = () => setOpenName('')
  const open = setOpenName;

  return <ModalContext.Provider value={{openName, close, open}}>{children}</ModalContext.Provider>
}

function Open({children, opens: opensWindowName}) {
  const {openName, close} = useContext(ModalContext)

  return cloneElement(children, {onClick: () => open(opensWindowName)});
}

function Window({children, name}) {
  const {openName, close} = useContext(ModalContext)
  if(name !== openName) return null;

  return createPortal(
    <div className={styles.overlay}>
    <div className={styles.modal}>
      <button onClick={close} className={styles.button}>&times;</button>
      <div>{children}</div>
      
    </div>
    </div>,
    document.body
  )
}


Modal.Open = Open
Modal.Window = Window


export default Modal
