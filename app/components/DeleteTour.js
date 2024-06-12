"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTour } from "../utils/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdDeleteForever } from "react-icons/md";

const DeleteTour = ({ tour }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    mutate,
    isPending: isDeleting,
    data: deletedTour,
  } = useMutation({
    mutationFn: deleteTour,
    onSuccess: (deletedTour) => {
      toast.success("Tour deleted");
      queryClient.invalidateQueries({ queryKey: ["gettours", "getTourById"] });
      router.push("/tours");
    },
    onError: (e) => {
      toast.error("Error deleting tour");
      console.log(e);
    },
  });

  const handleDelete = (tourToDelete) => {
    if (window.confirm("Are you sure you want to delete this tour?")) {
      mutate(tourToDelete);
    }
  };

  return (
    <div className="tooltip" data-tip={`Delete tour of ${tour.city}`}>
      <MdDeleteForever
        onClick={() => handleDelete(tour)}
        className="text-5xl text-secondary cursor-pointer"
      />
    </div>
  );
};

export default DeleteTour;
