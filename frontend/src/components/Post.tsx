import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { post } from "../services.ts";

type FormValues = {
  content: string;
};

const Post = () => {
  const { register, handleSubmit } = useForm<FormValues>();
  const postMutation = useMutation({
    mutationFn: (data: FormValues) => post(data.content),
  });

  return (
    <form
      className="h-24"
      onSubmit={handleSubmit((data) => postMutation.mutate(data))}
    >
      <div className="flex flex-col space-y-4 mx-auto py-2">
        <textarea
          rows={10}
          className="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg resize-none"
          id="content"
          {...register("content")}
        ></textarea>
        <button
          className="border-2 border-black py-2 px-4 rounded-full hover:underline"
          type="submit"
        >
          <span className="hover:underline">Post</span>
        </button>
      </div>
    </form>
  );
};

export default Post;