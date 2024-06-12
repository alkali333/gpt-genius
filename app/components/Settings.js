"use client";
import { TbSettingsQuestion } from "react-icons/tb";

const Settings = ({ setMessages, messages }) => {
  const setSystemMessage = (message) => {
    const newSystemMessage = { role: "system", content: message };
    setMessages([newSystemMessage, ...messages.slice(1)]);
  };

  return (
    <>
      <TbSettingsQuestion
        className="btn text-5xl"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      ></TbSettingsQuestion>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Settings;
