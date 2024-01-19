import { ContentState } from 'draft-js';
import { SyntheticEvent } from 'react';

export default function Link({
    children,
    contentState,
    entityKey,
    ...props
}: {
    children: React.ReactNode;
    contentState: ContentState;
    entityKey: string;
    props: any;
}) {
    const { url } = contentState.getEntity(entityKey).getData();

    const handleOpenLink = (e: SyntheticEvent) => {
        e.preventDefault();
        window.open(url);
    };

    return (
        <a href={url} className="underline text-blue-600 cursor-pointer" onClick={handleOpenLink}>
            {children}
        </a>
    );
}
