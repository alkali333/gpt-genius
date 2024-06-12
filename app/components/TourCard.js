import Link from "next/link";
import Image from "next/image";

const TourCard = ({ tour }) => {
  const { city, id, country } = tour;
  const formattedCity = city.replace(/\s+/g, "-").toLowerCase();
  const formattedCountry = country.replace(/\s+/g, "-").toLowerCase();

  return (
    <Link
      href={`/tours/all/${formattedCity}/${formattedCountry}`}
      className="card card-compact rounded-xl bg-base-300"
    >
      <div className="card-body items-center text-center">
        <h2 className="card-title text-center">
          {city}, {country}
        </h2>
        {tour.image && (
          <Image
            alt={`Panoramic Photo of ${tour.city}`}
            width={256}
            height={256}
            src={tour.image}
          />
        )}
      </div>
    </Link>
  );
};
export default TourCard;
