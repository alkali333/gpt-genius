"use client";
import { TbSettingsQuestion } from "react-icons/tb";
import { useState, useEffect } from "react";
import { FaArrowUp, FaCheck } from "react-icons/fa";
import toast from "react-hot-toast";

const Settings = ({ systemMessageIntro, setSystemMessageIntro }) => {
  const [tempSystemMessageIntro, setTempSystemMessageIntro] =
    useState(systemMessageIntro);
  const [isUpdated, setIsUpdated] = useState(true);

  const systemMessageOptions = [
    "You are a wise guru",
    "You are a life coach",
    "You are a harsh drill sergeant",
  ];

  useEffect(() => {
    setIsUpdated(true);
  }, [systemMessageIntro]);

  useEffect(() => {
    setIsUpdated(false);
  }, [tempSystemMessageIntro]);

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

  const changeSystemMessageIntro = (e) => {
    if (tempSystemMessageIntro === systemMessageIntro) return;
    e.preventDefault();
    setSystemMessageIntro(tempSystemMessageIntro);
    toast.success("System Message Updated!", { position: "top-center" });
    document.getElementById("my_modal_3").close();
  };

  return (
    <>
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        <TbSettingsQuestion className="text-3xl text-primary cursor-pointer" />
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg ml-2 mb-2">Change System Message</h3>
          <form className="join w-full" method="post">
            <select
              className="select select-bordered join-item w-full"
              value={tempSystemMessageIntro}
              onChange={(e) => setTempSystemMessageIntro(e.target.value)}
            >
              {systemMessageOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={changeSystemMessageIntro}
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
