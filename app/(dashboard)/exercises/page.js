const ExercisesPage = () => {
  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-primary text-2xl mb-7">Choose An Exercise</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded">
          Exercise 1
        </div>
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded">
          Exercise 2
        </div>
        <div className="w-full lg:w-1/3 bg-gray-100 p-4 rounded">
          Exercise 3
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
