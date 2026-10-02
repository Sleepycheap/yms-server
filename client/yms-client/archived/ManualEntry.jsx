import styles from './ManualEntry.module.css'

function ManualEntry({children, onClose}) {
  // createPortal places this component whereever I want in the DOM tree, while still retaining React tree placement
  return createPortal(
    <div>
      <label className={styles.title}>
        Manual Entry
      </label>
      <input type='text' ></input>
    </div>,
    // assigning the parentElement of ManualEntry to body
    document.body
  )
}

export default ManualEntry
