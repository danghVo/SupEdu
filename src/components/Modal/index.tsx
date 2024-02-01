import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    handleCloseModal: () => void;
}

export default function Modal({ children, width = '50%', height = '50%', handleCloseModal }: ModalProps) {
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
                      style={{ width, height }}
                      onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                      }}
                      className={`bg-white rounded-xl shadow-custom-1`}
                  >
                      {children}
                  </div>
              </div>,
              document.getElementById('modal-root')!,
          )
        : null;
}
