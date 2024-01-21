import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SyntheticEvent } from 'react';

export default function Slider({
    data,
    clickItem,
    itemUI,
}: {
    data: Array<any>;
    clickItem: (e: SyntheticEvent) => any;
    itemUI: (item: any) => React.ReactNode;
}) {
    return (
        <div className="flex w-full h-fit py-[8px] px-[4px] col-span-2 ">
            <div>
                <FontAwesomeIcon icon={faCaretLeft} />
            </div>
            <div className="relative grow overflow-hidden">
                <div className="flex absolute">
                    {data.map((item, index) => (
                        <div key={index} className="px-[4px]" onMouseDown={clickItem}>
                            {itemUI(item)}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <FontAwesomeIcon icon={faCaretRight} />
            </div>
        </div>
    );
}
