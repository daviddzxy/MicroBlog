import React from "react";


const UserBio: React.FC<{userName: string}> = ({userName}) => {
  return (
    <div className="justify-center py-2 px-2 divide-y">
        <span className="text-3xl">{userName}</span>
    </div>
  )
}

export default UserBio