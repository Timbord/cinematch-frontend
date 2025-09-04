export default function NowPlayingCard({ movie }) {
  return (
    <>
      <div className="relative rounded-[10px]">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}/`}
          alt="Now Playing"
          className="aspect-[16/9] object-cover rounded-[10px]"
        />
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 35%, rgba(0,0,0,1) 100%)",
          }}
          className="w-full h-full absolute top-0 left-0 rounded-[10px]"
        ></div>
        <div className="w-full h-full absolute top-0 left-0">
          <div
            className="absolute top-4 left-4 bg-white rounded-[5px]"
            style={{ boxShadow: "rgba(0, 0, 0, 0.75) -3px 7px 12px 1px" }}
          >
            <p className="text-black px-3 text-xs font-bold">NEU</p>
          </div>
          <p className="absolute bottom-4 left-4 font-bold">{movie.title}</p>
        </div>
      </div>
    </>
  );
}
