import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { classNames } from "@hkamran/utility-web";
import { Plus, Trash2, X } from "lucide-react";
import { StoryGroup } from "@/types/stories";
import { getStoryLinkDisplay } from "@/lib/editor";
import { addItem, updateGroupName } from "@/app/edit/[date]/actions";
import GroupLinkRow from "./EditGroup/GroupLinkRow";
import AddLink from "../modals/AddLink";
import DeleteItem from "../modals/DeleteItem";

type Props = {
    open: boolean;
    setOpen: (newState: boolean) => void;
    group: StoryGroup;
    index: number;
};

const EditGroup = ({ open, setOpen, group, index: groupIndex }: Props) => {
    const params = useParams() as { date: string };
    const [_, startTransition] = useTransition();

    const [name, setName] = useState<string>(group.name);
    const [nameChanged, setNameChanged] = useState<boolean>(false);

    const [openAdd, setOpenAdd] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);

    useEffect(() => setNameChanged(name.trim() !== group.name.trim()), [name]);

    return (
        <>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto relative w-screen max-w-lg">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-hk-grey">
                                            <div className="px-4 sm:px-6">
                                                <Dialog.Title className="flex items-center text-base font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                                    <span className="flex-1">
                                                        Edit Group
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="relative rounded-md hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                    >
                                                        <span className="absolute -inset-2.5" />
                                                        <span className="sr-only">
                                                            Close panel
                                                        </span>
                                                        <X
                                                            className="h-6 w-6"
                                                            aria-hidden="true"
                                                        />
                                                    </button>
                                                </Dialog.Title>
                                            </div>

                                            <div className="relative mt-6 flex-1 space-y-8 px-4 sm:px-6">
                                                {/* Name Field */}
                                                <div>
                                                    <label
                                                        htmlFor="name"
                                                        className="block text-sm font-medium text-gray-900 dark:text-gray-100"
                                                    >
                                                        Name
                                                    </label>
                                                    <div className="flex items-center">
                                                        <div className="mt-1 flex-1">
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-hk-grey-light sm:text-sm"
                                                                value={name}
                                                                onChange={async (
                                                                    e,
                                                                ) => {
                                                                    const {
                                                                        value,
                                                                    } =
                                                                        e.currentTarget;
                                                                    setName(
                                                                        value,
                                                                    );
                                                                }}
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className={classNames(
                                                                "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 ease-in-out sm:ml-3 sm:w-auto",
                                                                !nameChanged
                                                                    ? "bg-gray-500"
                                                                    : "bg-indigo-600 hover:bg-indigo-500",
                                                            )}
                                                            disabled={
                                                                !nameChanged
                                                            }
                                                            onClick={() => {
                                                                startTransition(
                                                                    () =>
                                                                        updateGroupName(
                                                                            params.date,
                                                                            groupIndex,
                                                                            name,
                                                                        ),
                                                                );
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            Update
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Links */}
                                                <div>
                                                    <p className="mb-1 flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        <span className="flex-1">
                                                            Links
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="transition-colors duration-150 ease-in-out hover:text-indigo-500"
                                                            onClick={() => {
                                                                setOpenAdd(
                                                                    true,
                                                                );
                                                                setOpen(false);
                                                            }}
                                                        >
                                                            <Plus size={20} />
                                                        </button>
                                                    </p>
                                                    <ul className=" space-y-1 text-xs leading-5 text-gray-500">
                                                        {group.links.map(
                                                            (link, index) => {
                                                                const storyLink =
                                                                    getStoryLinkDisplay(
                                                                        link,
                                                                    );
                                                                return (
                                                                    <li
                                                                        key={
                                                                            storyLink
                                                                        }
                                                                    >
                                                                        <GroupLinkRow
                                                                            link={
                                                                                link
                                                                            }
                                                                            index={
                                                                                index
                                                                            }
                                                                            groupIndex={
                                                                                groupIndex
                                                                            }
                                                                            length={
                                                                                group
                                                                                    .links
                                                                                    .length
                                                                            }
                                                                        />
                                                                    </li>
                                                                );
                                                            },
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>

                                            <div className="px-4 py-2 text-sm sm:px-6">
                                                <button
                                                    type="button"
                                                    className="flex space-x-2 transition-colors duration-150 ease-in-out hover:text-red-500"
                                                    onClick={() => {
                                                        setOpenDelete(true);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Trash2 size={20} />
                                                    <span>Delete Group</span>
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            <AddLink
                open={openAdd}
                setOpen={setOpenAdd}
                add={(link, groupIndex) =>
                    startTransition(() =>
                        addItem(params.date, link, undefined, true, groupIndex),
                    )
                }
                groupIndex={groupIndex}
            />

            <DeleteItem
                open={openDelete}
                setOpen={setOpenDelete}
                item={`${group.name} (${group.links.length} stor${
                    group.links.length !== 1 ? "ies" : "y"
                })`}
                index={groupIndex}
            />
        </>
    );
};

export default EditGroup;
