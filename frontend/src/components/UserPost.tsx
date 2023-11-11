import React from "react";
import {Link} from "react-router-dom";

const UserPost: React.FC<{
  id: number,
  content: string,
  createdAt: Date,
  userName: string
}> = (
  {
    id,
    content,
    createdAt,
    userName
  }
) => {
  const date = new Date(createdAt)
  return (
    <article className="flex flex-col justify-center py-2 px-2" key={id}>
      <div><Link to={`/user/${userName}`} className="text-lg px-2 hover:underline">{userName}</Link> <span
        className="text-xs">{date.getDay()}. {date.getMonth()}. {date.getFullYear()}</span></div>
      <div>{content}</div>
    </article>
  )
}

export default UserPost