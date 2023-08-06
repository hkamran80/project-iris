"use client";

type Props = { addDate: () => void };

const AddDateButton = ({ addDate }: Props) => (
    <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => addDate()}
    >
        New
    </button>
);

export default AddDateButton;
