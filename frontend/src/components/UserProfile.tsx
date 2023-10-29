import React from "react";
import {useMutation, useQuery} from "react-query";
import {fetchUser, followUser} from "../services.ts";
import axios from "axios";

const UserProfile: React.FC<{ userName: string }> = ({userName}) => {
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess
  } = useQuery(
    ['user', userName],
    () => fetchUser(userName)
  )

  const followMutation = useMutation({
      mutationFn: (userName: string) => followUser(userName),
    }
  )

  let content
  switch (true) {
    case isLoading:
      content = <div>Loading...</div>;
      break;

    case isError:
      if (axios.isAxiosError(error)) {
        content = <div>{error.response?.data.detail}</div>;
      }
      break;

    case isSuccess: {
      const date = data ? new Date(data.createdAt) : null
      content = (
        <div className="justify-center py-2 px-2">
          <span className="text-3xl">{userName}</span>
          {date && <span className="px-2">Joined {date.getDay()}. {date.getMonth()}. {date.getFullYear()}</span>}
          <button className="border-2 border-black py-1 px-1 rounded-full hover:underline" onClick={() => followMutation.mutate(userName)}>Follow</button>
        </div>
      )
      break;
    }
  }

  return (
    <div>
      {content}
    </div>
  )
}

export default UserProfile