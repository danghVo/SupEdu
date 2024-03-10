import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    handleCloseModal: () => void;
}

export default function Modal({ children, width = 'w-[50%]', height = 'h-[50%]', handleCloseModal }: ModalProps) {
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
    }, []);

    return load
        ? ReactDOM.createPortal(
              <div
                  onClick={handleCloseModal}
                  className="fixed w-screen h-screen top-0 bg-slate-800/50 z-[1000] flex items-center justify-center"
              >
                  <div
                      onClick={(e) => {
                          e.stopPropagation();
                      }}
                      className={`${`${height} ${width}`} bg-white rounded-xl shadow-custom-1 relative`}
                  >
                      <div
                          className="absolute right-[16px] top-[8px] cursor-pointer"
                          onClick={() => handleCloseModal()}
                      >
                          <FontAwesomeIcon icon={faXmark} className="h-[32px]" />
                      </div>
                      {children}
                  </div>
              </div>,
              document.getElementById('modal-root')!,
          )
        : null;
}
