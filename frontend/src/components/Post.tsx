import React from "react";
import { Link } from "react-router-dom";

const Post: React.FC<{id: number, content: string, created_at: Date, user_name: string}> = ({id, content, created_at, user_name}) => {
  const date = new Date(created_at)
  return (
      <article className="flex flex-col justify-center py-2 px-2 divide-y" key={id}>
        <div><Link to={`/user/${user_name}`} className="text-lg px-2 hover:underline">{user_name}</Link> <span className="text-xs">{date.getDay()}. {date.getMonth()}. {date.getFullYear()}</span></div>
        <div>{content}</div>
      </article>
    )
}

export default Post