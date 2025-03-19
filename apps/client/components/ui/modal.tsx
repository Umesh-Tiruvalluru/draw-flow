import { ReactNode } from "react";
// import { RxCross2 } from "react-icons/rx";

export default function Modal({
  children,
  close,
  setClose,
}: {
  children: ReactNode;
  close: boolean;
  setClose: () => void;
}) {
  return (
    close && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        onClick={setClose}
      >
        <div
          className="bg-white p-6 rounded-md relative max-w-lg w-full shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button
            className="absolute top-2 right-2 text-xl text-gray-600 hover:text-red-500"
            onClick={setClose}
          >
            &times;
          </button>
          <div className="space-y-3 mt-5">{children}</div>
        </div>
      </div>
    )
  );
}
