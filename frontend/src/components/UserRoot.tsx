import { useParams } from "react-router-dom";
import { Outlet } from "react-router-dom"

const UserRoot = () => {
  const { userName } = useParams();
  if (userName === undefined) {
    return <div>Error</div>
  }

  return (
    <Outlet context={userName}/>
  )
}

export default UserRoot