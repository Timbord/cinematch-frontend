import React from "react";
import moment from "moment";
import 'moment/dist/locale/de';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";

export default function MovieCard({ data }) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        <Image
          alt="Movie Poster"
          radius="sm"
          src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}
          width={300}
        />
      </CardHeader>
      <Divider />
      <CardBody>
        <h2>{data.title}</h2>
      </CardBody>
      <Divider />
      <CardFooter>
        <p>{moment(data.release_date).format('Do MMMM YYYY')}</p>
      </CardFooter>
    </Card>
  );
}
