import { useState, Fragment, useRef, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { classNames } from "@hkamran/utility-web";
import { Dialog, Transition } from "@headlessui/react";
import { isValidURL } from "@/lib/strings";
import { addItem, deleteItem } from "@/app/edit/[date]/actions";
import type { StoryGroup } from "@/types/stories";

type Props = {
    open: boolean;
    setOpen: (newState: boolean) => void;
    firstNonGroupIndex: number;
};

const AddGroup = ({ open, setOpen, firstNonGroupIndex }: Props) => {
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    const [name, setName] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [title, setTitle] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(true);

    const cancelButtonRef = useRef(null);

    const close = () => {
        setOpen(false);
        setName("");
        setLink("");
        setTitle("");
    };

    const addGroup = () => {
        const linkItem =
            title !== undefined && title.trim() !== "" ? { link, title } : link;

        startTransition(() =>
            addItem(
                params.date,
                { name, links: [linkItem] },
                firstNonGroupIndex,
                true,
            ),
        );
        close();
    };

    useEffect(
        () =>
            setDisabled(
                name.trim() === "" ||
                    link.trim() === "" ||
                    !isValidURL(link.trim()),
            ),
        [name, link],
    );

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-150"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all dark:bg-hk-grey sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                    >
                                        Add Group
                                    </Dialog.Title>
                                    <div className="mt-4 space-y-4">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                                            >
                                                Name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-hk-grey-light sm:text-sm"
                                                    value={name}
                                                    onChange={async (e) => {
                                                        const { value } =
                                                            e.currentTarget;
                                                        setName(value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <hr />

                                        <div>
                                            <label
                                                htmlFor="link"
                                                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                                            >
                                                Link
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="url"
                                                    name="link"
                                                    id="link"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-hk-grey-light sm:text-sm"
                                                    value={link}
                                                    onChange={async (e) => {
                                                        const { value } =
                                                            e.currentTarget;
                                                        setLink(value);
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="title"
                                                className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                                            >
                                                Title (optional)
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    id="title"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-hk-grey-light sm:text-sm"
                                                    value={title}
                                                    onChange={async (e) => {
                                                        const { value } =
                                                            e.currentTarget;
                                                        setTitle(value);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className={classNames(
                                            "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out sm:ml-3 sm:w-auto",
                                            disabled
                                                ? "bg-gray-500"
                                                : "bg-indigo-600 hover:bg-indigo-500",
                                        )}
                                        disabled={disabled}
                                        onClick={() => addGroup()}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-colors duration-150 ease-in-out hover:bg-gray-50 dark:bg-hk-grey dark:text-gray-100 dark:ring-gray-700 dark:hover:bg-hk-grey-hover sm:mt-0 sm:w-auto"
                                        onClick={() => close()}
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AddGroup;
