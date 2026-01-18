export default function ErrorPg({ error }: { error: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        Unfortunately an error has occurred...
      </h1>
      <p>{error}</p>
    </div>
  );
}
