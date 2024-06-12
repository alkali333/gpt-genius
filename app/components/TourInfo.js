import Image from "next/image";

const TourInfo = ({ tour }) => {
  const { title, description, stops } = tour;
  return (
    <div className="max-w-2xl">
      <h1 className="text-primary text-4xl mb-4">{title}</h1>
      {tour.image && (
        <Image
          className="mb-3"
          alt={`Panoramic Photo of ${tour.city}`}
          width={512}
          height={512}
          src={tour.image}
        />
      )}
      <p className="leading-loose mb-6">{description}</p>
      <ul>
        {stops.map((stop, index) => (
          <li key={index} className="mb-4 bg-base-100 p-4 rounded-md">
            <p>{stop}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TourInfo;
