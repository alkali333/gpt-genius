"use client";
import { TbSettingsQuestion } from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaArrowUp, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const Settings = ({ systemMessage, setSystemMessage }) => {
  const [tempSystemMessage, setTempSystemMessage] = useState(systemMessage);
  const [isUpdated, setIsUpdated] = useState(true);

  // mark as updated once changed
  useEffect(() => {
    setIsUpdated(true);
  }, [systemMessage]);

  // as soon as they start changing the message...
  useEffect(() => {
    setIsUpdated(false);
  }, [tempSystemMessage]);

  // this is added to make the modal close when you click out
  // off it. Maybe overkill.
  useEffect(() => {
    const modal = document.getElementById("my_modal_3");
    const handleClose = (event) => {
      if (event.target === modal) {
        modal.close();
      }
    };
    modal.addEventListener("click", handleClose);
    return () => modal.removeEventListener("click", handleClose);
  }, []);

  const changeSystemMessage = (e) => {
    if (tempSystemMessage === systemMessage) return;
    e.preventDefault();
    setSystemMessage(tempSystemMessage);
    toast.success("System Message Updated!", { position: "top-center" });
    document.getElementById("my_modal_3").close();
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        <TbSettingsQuestion
          className="text-3xl text-primary cursor-pointer"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        ></TbSettingsQuestion>
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg ml-2 mb-2">Change System Message</h3>
          <form className="join w-full" method="post">
            <input
              type="text"
              name="systemMessageInput"
              placeholder="Type here"
              className="input input-bordered join-item w-full"
              onChange={(e) => setTempSystemMessage(e.target.value)}
              maxLength={1500}
              value={tempSystemMessage}
              required
            />
            <button
              onClick={changeSystemMessage}
              className={`btn ${
                isUpdated ? "bg-green-400 hover:bg-green-400 " : "btn-primary "
              } join-item rounded-r-full`}
            >
              {isUpdated ? <FaCheck /> : <FaArrowUp />}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Settings;
