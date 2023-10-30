import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {fetchUser, followUser, unfollowUser} from "../services.ts";
import axios from "axios";

const UserProfile: React.FC<{ userName: string }> = ({userName}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHoveringOverFollowButton, setIsHoveringOverFollowButton] = useState(false);
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
      mutationFn: (userName: string) => isFollowing ? unfollowUser(userName) : followUser(userName),
      onSuccess: () => {
        setIsFollowing((prevIsFollowing) => !prevIsFollowing)
      }
    }
  )

  useEffect(() => {
    if (isSuccess && data) {
      setIsFollowing(data.isFollowing);
    }
  }, [isSuccess, data]);

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
          <button
            className="border-2 border-black py-1 px-1 rounded-full hover:underline hover:text-red-600"
            onMouseEnter={() => setIsHoveringOverFollowButton(true)}
            onMouseLeave={() => setIsHoveringOverFollowButton(false)}
            onClick={() => followMutation.mutate(userName)}
          >
            {
              isFollowing && isHoveringOverFollowButton ? "Unfollow"
                : isFollowing && !isHoveringOverFollowButton ? "Following"
                  : "Follow"
            }
          </button>
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