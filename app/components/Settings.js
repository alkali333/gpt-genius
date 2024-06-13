"use client";
import { TbSettingsQuestion } from "react-icons/tb";
import { useState } from "react";

const Settings = ({ systemMessage, setSystemMessage }) => {
  const [tempSystemMessage, setTempSystemMessage] = useState(systemMessage);
  const changeSystemMessage = (e) => {
    e.preventDefault();
    setSystemMessage(tempSystemMessage);
  };

  return (
    <>
      {/* The button to open modal */}
      <a href="#my_modal_8" className="btn">
        <TbSettingsQuestion
          className="text-3xl text-primary cursor-pointer"
          onClick={() => document.getElementById("my_modal_6").showModal()}
        ></TbSettingsQuestion>
      </a>
      {/* Put this part before </body> tag */}
      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-3">Change System Message</h3>
          <div className="join">
            <input
              type="text"
              name="systemMessageInput"
              placeholder="Type here"
              className="input input-bordered join-item"
              onChange={(e) => setTempSystemMessage(e.target.value)}
              value={tempSystemMessage}
            />
            <button
              onClick={changeSystemMessage}
              className="btn join-item rounded-r-full"
            >
              Change
            </button>
          </div>
          <div className="modal-action">
            <a href="#" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
