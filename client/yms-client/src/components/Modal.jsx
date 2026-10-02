import styles from './Modal.module.css'
import { useState } from 'react'
import Button from './Button'
import {createPortal} from 'react-dom'

/*
Modal component that displays on top of other elements
The children prop receives and displays the elements sent from the parent component
*/

function Modal({children, onClose}) {
  // createPortal places this component whereever I want in the DOM tree, while still retaining React tree placement
  return createPortal(
    <div className={styles.overlay}>
    <div className={styles.modal}>
      <button onClick={onClose} className={styles.button}>&times;</button>
      <div>{children}</div>
      
    </div>
    </div>,
    // assigning the parentElement of Modal to body
    document.body
  )
}

export default Modal
