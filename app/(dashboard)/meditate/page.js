import AudioPlayer from "../../components/AudioPlayer";

const MeditatePage = () => {
  return (
    <div className="flex flex-col sm:flex-row max-w-4xl pt-12 gap-4 items-center">
      <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Morning Meditation</h2>
          <p>Do this short meditation first thing in the morning</p>
          <div className="card-actions justify-end">
            <AudioPlayer audioSrc="/ave-maria.mp3" />
          </div>
        </div>
      </div>
      <div className="card bg-neutral text-neutral-content w-96">
        <div className="card-body items-center text-center">
          <h2 className="card-title">Evening Meditation</h2>
          <p>Do this short meditation just before you go to bed</p>
          <div className="card-actions justify-end">
            <AudioPlayer audioSrc="/ave-maria.mp3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeditatePage;
