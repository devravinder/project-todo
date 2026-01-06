import useFileHandle from "../hooks/useFileHandler";
import { fileErrorMessages, welcomeData } from "../util/constants";
import type { FileHandleResult } from "../util/FileHandler";
import { FOLDER, LOADING } from "../util/icons";
import type { FileError } from "../util/syncStore";

export default function Welcome({
  onGetStarted,
  fileError,
}: {
  onGetStarted: (fileHandleResult: FileHandleResult) => void;
  fileError?: FileError;
}) {
  const { isOpening, openFolder } = useFileHandle();
  const onClick = async () => {
    const fileHandle = await openFolder();
    onGetStarted(fileHandle);
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100">
      <div className="rounded-lg w-full h-full sm:h-10/12 sm:w-10/12 md:w-8/12 md:h-10/12 p-20 flex flex-col gap-8 items-center">
        <h2 className="text-4xl font-serif font-semibold text-slate-900">
          {welcomeData.header}
        </h2>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row justify-center items-center">
            <button
              onClick={onClick}
              disabled={isOpening}
              className="cursor-pointer disabled:cursor-not-allowed rounded-lg w-56 px-12 py-3 bg-blue-500 text-white"
            >
              {isOpening ? (
                <span className="inline-block animate-spin">{LOADING}</span>
              ) : (
                <span>{FOLDER}</span>
              )}{" "}
              Get Started
            </button>
          </div>
          <div className="flex flex-row justify-center items-center">
            {fileError && (
              <span className="text-red-500 text-sm w-fit px-4">
                {fileErrorMessages[fileError.name] || fileError.message}
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-500">{welcomeData.subTitle}</div>

        <div className="w-full xl:w-8/12 bg-white rounded-xl p-8 flex flex-col gap-8">
          <div className="text-xl font-semibold text-slate-800">
            {welcomeData.notes.header}
          </div>
          <ol className="list-decimal list-inside flex flex-col gap-1">
            {welcomeData.notes.items.map((item) => (
              <li className="text-sm text-slate-600" key={item}>
                {item}
              </li>
            ))}
          </ol>
          <div className="text-md font-semibold text-slate-600">
            {welcomeData.notes.footer}
          </div>
        </div>
      </div>
    </div>
  );
}
