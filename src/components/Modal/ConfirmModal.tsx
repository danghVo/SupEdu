import Modal from '.';
import Button from '../Button';

export default function ConfirmModal({
    title,
    width,
    height,
    handleYes,
    handleCloseModal,
}: {
    title: string;
    width?: string | number;
    height?: string | number;
    handleYes: () => void;
    handleCloseModal: () => void;
}) {
    return (
        <Modal width={width || 'fit-content'} height={height || 'fit-content'} handleCloseModal={handleCloseModal}>
            <div className="px-[64px] py-[16px]">
                <div className="mb-[32px]">{title}</div>
                <div className="flex gap-[32px] justify-center items-center">
                    <Button
                        className="rounded-lg w-[100px]"
                        handleClick={() => {
                            handleYes();
                            handleCloseModal();
                        }}
                    >
                        Có
                    </Button>
                    <Button theme="fill" className="rounded-lg w-[100px]" handleClick={handleCloseModal}>
                        Không
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
