import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';

export default function Loading({ className }: { className?: string }) {
    return (
        <div className={`grow h-full flex justify-center items-center ${className || 'text-[64px]'}`}>
            <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ type: 'tween', duration: 1, repeat: Infinity }}
            >
                <FontAwesomeIcon icon={faCircleNotch} className="" />
            </motion.div>
        </div>
    );
}
