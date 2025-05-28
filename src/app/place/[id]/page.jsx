import PlaceDetails from "../../components/PlaceDetails";

export default function PlacePage({ params }) {
    return <PlaceDetails id={params.id} />;
}
