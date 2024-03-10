import { faUserPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Button from '~/components/Button';
import Input from '~/components/Input';
import Modal from '~/components/Modal';
import { AnimatePresence, motion } from 'framer-motion';

export default function AddMember({ link }: { link: string }) {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [emailMember, setEmailMember] = useState('');

    const handleCopyLinkToClipBoard = () => {
        window.navigator.clipboard.writeText(link);
    };

    return (
        <>
            <div
                onClick={() => {
                    setOpenAddModal(true);
                }}
                className="bg-white w-[200px] px-[12px] py-[16px] flex items-center justify-center gap-[8px] mb-[32px] rounded-full shadow-custom-3 cursor-pointer"
            >
                <FontAwesomeIcon icon={faUserPlus} className="text-[18px]" />
                <span>Thêm thành viên</span>
            </div>

            <AnimatePresence>
                {openAddModal && (
                    <Modal
                        width={'fit-content'}
                        height={'fit-content'}
                        handleCloseModal={() => {
                            setOpenAddModal(false);
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative bg-white px-[16px] py-[18px] rounded-lg"
                        >
                            <div
                                className="absolute right-[16px] top-0 text-[24px]"
                                onClick={() => {
                                    setOpenAddModal(false);
                                }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div className="text-center mb-[16px] text-[24px] font-semibold uppercase">
                                Thêm thành viên
                            </div>
                            <div className="flex items-center mt-[12px] mb-[24px]">
                                <div className="whitespace-nowrap mx-[8px]">Email thành viên</div>
                                <Input
                                    classNameWrapper="mt-0 rounded-lg h-[40px] px-[8px]"
                                    value={emailMember}
                                    onChange={setEmailMember}
                                />
                                {emailMember && (
                                    <Button handleClick={() => {}} className="ml-[8px] rounded-lg">
                                        Xác nhận
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center">
                                <div className="mx-[8px]">Hoặc</div>
                                <div className="bg-white rounded-lg w-full h-[40px] flex justify-between items-center overflow-hidden">
                                    <div className="ml-[12px] border-2 border-r-0 border-black grow h-full rounded-l-lg flex items-center px-[12px]">
                                        {link}
                                    </div>
                                    <Button
                                        handleClick={handleCopyLinkToClipBoard}
                                        className="rounded-none rounded-r-lg"
                                    >
                                        Copy link
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}
