import { useNavigate, useRouteError } from "react-router-dom"
import LinkButton from './LinkButton'
import Button from "./Button";

function Error() {
  const error = useRouteError();
  const navigate = useNavigate()

  function handleBack() {
    navigate(-1)
  }

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error.data || error.message}</p>

      <Button type='secondary' onClick={() => handleBack()}>&larr; Go Back</Button>
    </div>
  )
}

export default Error
