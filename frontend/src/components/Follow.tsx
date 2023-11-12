import React from "react";
import { Link } from "react-router-dom";

const Follow: React.FC<{
  id: number,
  createdAt: Date,
  userName: string
}> = (
  {
    id,
    createdAt,
    userName
  }
) => {
  const date = new Date(createdAt)
  console.log(date)
  return <div key={id}>
    <Link className="text-3xl hover:underline" to={`/user/${userName}`}>{userName}</Link>
    <span className="px-2">Following since {date.getDay()}. {date.getMonth()}. {date.getFullYear()}</span>
  </div>
}

export default Follow