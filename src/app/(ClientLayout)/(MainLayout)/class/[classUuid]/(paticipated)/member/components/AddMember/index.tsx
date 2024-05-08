import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {motion } from 'framer-motion';

import Button from '~/components/Button';
import Input from '~/components/Input';
import emailRule from '~/components/Input/rules/emailRule';
import Modal from '~/components/Modal';

export default function AddMember({
    handleSubmit,
    link,
}: {
    handleSubmit: (email: string) => Promise<String>;
    link: string;
}) {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [emailMember, setEmailMember] = useState('');
    const [error, setError] = useState<String>('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            
            }, 2000)
        }
    }, [copied])

    const handleCopyLinkToClipBoard = () => {
        setCopied(true);
        window.navigator.clipboard.writeText(link);
    };

    const handleAddMember = async () => {
        if (!emailMember) return;

        const res = await handleSubmit(emailMember);

        if (!res) {
            setEmailMember('');
            setOpenAddModal(false);
        } else setError(res);
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

            {openAddModal && (
                <Modal
                    width={'w-[500px]'}
                    height={'fit-content'}
                    handleCloseModal={() => {
                        setOpenAddModal(false);
                        setError('');
                        setEmailMember('');
                    }}
                >
                    <div className="bg-white px-[16px] py-[18px] rounded-lg">
                        <div className="text-center mb-[16px] text-[24px] font-semibold uppercase">Thêm thành viên</div>
                        {error && (
                            <div className="rounded-lg w-full px-[12px] py-[4px] bg-red-200 text-red-500 mt-[px]">
                                {error}
                            </div>
                        )}
                        <div className="flex items-center mt-[12px] mb-[24px]">
                            <div className="whitespace-nowrap mx-[8px]">Email thành viên</div>
                            <Input
                                classNameWrapper="mt-0 rounded-lg h-[40px] px-[8px]"
                                value={emailMember}
                                rules={[emailRule]}
                                onChange={setEmailMember}
                            />
                            {emailMember && (
                                <Button handleClick={() => handleAddMember()} className="ml-[8px] rounded-lg">
                                    Thêm
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center">
                            <div className="mx-[8px]">Hoặc</div>
                            <div className="relative bg-white rounded-lg w-[400px] h-[40px] flex justify-between items-center">
                                <div className="ml-[12px] border-2 border-r-0 border-black h-full rounded-l-lg flex items-center px-[12px] overflow-hidden">
                                    <span className="truncate">{link}</span>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: -1 }}
                                    animate={copied ? { opacity: 1, y: 1 } : { opacity: 0, y: -1 }}
                                    className='absolute right-[24px] top-[-110%] bg-black text-white text-[12px] p-[8px] rounded-lg 
                                                after:content-[""] after:absolute after:top-[99%] after:right-[50%] after:translate-x-1/2 after:block after:w-[0px] after:h-[0px] after:border-[8px] after:border-solid after:border-transparent after:border-t-black
                                                '>
                                    Copied
                                </motion.div>
                                <Button
                                    handleClick={handleCopyLinkToClipBoard}
                                    className="rounded-none rounded-r-lg w-[200px]"
                                >
                                    Copy link
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
