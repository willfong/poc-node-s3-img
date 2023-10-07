import FileUploader from "./FileUploader";

function App() {
  return (
    <div className="w-fill lg:w-1/2 bg-slate-200 mx-auto lg:my-4 rounded-lg p-8">
      <h1 className="text-3xl">S3 Image Uploader Demo</h1>
      <div className="my-8 bg-amber-100 p-4">
        <FileUploader />
      </div>
    </div>
  );
}
export default App;
