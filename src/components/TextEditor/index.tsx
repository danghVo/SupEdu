'use client';

import { SyntheticEvent, useEffect, useRef, useState } from 'react';

import {
    ContentBlock,
    ContentState,
    EditorState,
    Entity,
    // Editor,
    RichUtils,
    SelectionState,
    genKey,
    getDefaultKeyBinding,
    getVisibleSelectionRect,
    convertFromRaw,
    CompositeDecorator,
} from 'draft-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAlignCenter,
    faAlignJustify,
    faAlignLeft,
    faAlignRight,
    faBold,
    faEllipsis,
    faItalic,
    faLink,
    faListUl,
    faUnderline,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, easeIn, motion } from 'framer-motion';
import './TextEditor.scss';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import Video from './components/Video';
import Link from './components/Link';
import dynamic from 'next/dynamic';
import getVideoId from '~/utils/getVideoId';
import getCurrentBlockIndex from './utils/getCurrentBlockIndex';
import createBlock from './utils/createBlock';

const Editor = dynamic(() => import('draft-js').then((mod) => mod.Editor), {
    ssr: false,
});

const styleMap = {
    SELECTIONLINK: {
        backroundColor: 'gray',
        color: 'black',
    },
};

const decorator = new CompositeDecorator([
    {
        strategy: (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges((value) => {
                const entityKey = value.getEntity();

                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === 'LINK' &&
                    contentState.getEntity(entityKey).getData()
                );
            }, callback);
        },
        component: Link,
    },
]);

export default function TextEditor({ className = '', label }: { className?: string; label: string }) {
    const [editor, setEditor] = useState<{
        state: EditorState;
        style: Array<string>;
        type: string;
    }>({
        state: EditorState.createWithContent(
            convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        text: '',
                        key: 'editor',
                        type: 'unstyled',
                        entityRanges: [],
                        depth: 0,
                        inlineStyleRanges: [],
                    },
                ],
            }),
            decorator,
        ),
        style: [],
        type: '',
    });

    const [toolboxOffsetStyle, setToolboxOffsetStyle] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const [toolboxType, setToolboxType] = useState<{
        offsetTop: number;
        isOpen: boolean;
        isFocus: boolean;
    }>({ offsetTop: 16, isOpen: false, isFocus: false });

    const [inputLink, setInputLink] = useState<{
        isOpen: boolean;
        isFocus: boolean;
        value: string;
        selectionState: SelectionState | null;
    }>({
        isOpen: false,
        value: '',
        isFocus: false,
        selectionState: null,
    });

    const [link, setLink] = useState('');
    const [isCreateNewBlock, setIsCreateNewBlock] = useState(false)

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const toolboxRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const selection = editor.state.getSelection();
        const startOffset = selection.getStartOffset();
        const endOffset = selection.getEndOffset();
        const selectionRect = getVisibleSelectionRect(window);
        let offsetTop = toolboxType.offsetTop;

        if (wrapperRef.current && selectionRect) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();

            if (
                selectionRect.top > wrapperRect.top &&
                selectionRect.top < wrapperRect.bottom &&
                selectionRect.left > wrapperRect.left &&
                selectionRect.right < wrapperRect.right
            ) {
                if (startOffset !== endOffset) {
                    setToolboxOffsetStyle({
                        top: selectionRect.top - wrapperRect.top - 16,
                        left: selectionRect.left - wrapperRect.left + (selectionRect.width * 50) / 100,
                    });
                } else {
                    setToolboxOffsetStyle(null);
                    setInputLink((prev) => ({ ...prev, value: '', isOpen: false }));
                }

                offsetTop = selectionRect.top - wrapperRect.top;
            }
        } else if (!editor.state.getCurrentContent().getPlainText()) {
            offsetTop = 16;
        }

        setToolboxType((prev) => ({ ...prev, offsetTop }));
    }, [editor.state, toolboxType.isFocus]);

    useEffect(() => {
        if(isCreateNewBlock) {
            createBlock('', '', editor.state, handleChange,getCurrentBlockIndex(editor.state))
            setIsCreateNewBlock(false)
        }
    }, [isCreateNewBlock])

    const handleChange = (editorState: EditorState) => {
        setEditor({
            state: editorState,
            style: editorState.getCurrentInlineStyle().toArray(),
            type: editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getAnchorKey()).getType(),
        });

        const currentAnchor = {
            key: editorState.getSelection().getAnchorKey(),
            offset: editorState.getSelection().getAnchorOffset(),
        };

        const currentEntityKey = editorState
            .getCurrentContent()
            .getBlockForKey(currentAnchor.key)
            .getEntityAt(currentAnchor.offset);

        if (currentEntityKey) {
            const currentEntity = editorState.getCurrentContent().getEntity(currentEntityKey);

            if (currentEntity.getType() === 'LINK') {
                setLink(currentEntity.getData().url);
            } else setLink('');
        } else setLink('');
    };

    const handleUndo = (e: any) => {
        if (e.key === 'z' && e.ctrlKey) {
            handleChange(EditorState.undo(editor.state));
        }
    };

    const handleFocusEditor = () => {
        setToolboxType((prev) => ({ ...prev, isFocus: true }));
    };

    const handleBlurEditor = () => {
        if (!inputLink.isFocus) {
            setToolboxOffsetStyle(null);
            setToolboxType((prev) => ({ ...prev, isFocus: false }));
        }
    };

    const handleTextStyle = (e: SyntheticEvent, command: string) => {
        e.preventDefault();
        let newEditorState = RichUtils.toggleInlineStyle(editor.state, command);

        handleChange(newEditorState);
    };

    const handleBlockStyle = (contentBlock: ContentBlock) => {
        switch (contentBlock.getType()) {
            case 'center': {
                return 'apply-center';
            }
            case 'left': {
                return 'apply-left';
            }
            case 'right': {
                return 'apply-right';
            }
            case 'justify': {
                return 'apply-justify';
            }
            case 'youtubeInput': {
                return 'my-[12px] px-[16px] py-[12px] bg-slate-100';
            }
            default: {
                return '';
            }
        }
    };

    const handleOpenTypeBox = (e: SyntheticEvent) => {
        e.preventDefault();

        setToolboxType((prev) => ({ ...prev, isOpen: true }));
    };

    const handleType = (e: SyntheticEvent, command: string) => {
        e.preventDefault();
        if (command === 'add-youtube-link') {
            return createBlock('add-youtube-link', '', editor.state, handleChange, getCurrentBlockIndex(editor.state));
        }

        let newEditorState = RichUtils.toggleBlockType(editor.state, command);

        handleChange(newEditorState);
    };

    const handleKeyBinding = (e: any) => {
        const currentContent = editor.state.getCurrentContent();
        const currentSelection = editor.state.getSelection().getAnchorKey();
        const currentBlock = currentContent.getBlockForKey(currentSelection);
        if (e.key === 'Enter' && currentBlock.getType() === 'add-youtube-link') {
            return 'loadYoutubeVideo';
        } else return getDefaultKeyBinding(e);
    };

    const handleKeyCommand = (command: string, editorState: EditorState) => {
        if (command === 'loadYoutubeVideo') {
            const currentContent = editor.state.getCurrentContent();
            const currentSelection = editor.state.getSelection().getAnchorKey();
            const currentBlock = currentContent.getBlockForKey(currentSelection);
            if (getVideoId(currentBlock.getText())) {
                handleChange(RichUtils.toggleBlockType(editorState, 'loadYoutubeVideo'))
                setIsCreateNewBlock(true)
                return 'handled';
            } else return 'not-handled';
        } else return 'not-handled';
    };

    const customRenderBlock = (contentBlock: ContentBlock) => {
        const type = contentBlock.getType();
        if (type === 'add-youtube-link' || type === 'loadYoutubeVideo') {
            const videoId = getVideoId(contentBlock.getText());
            return {
                component: Video,
                editable: type === 'add-youtube-link',
                props: {
                    src: type === 'loadYoutubeVideo' ? videoId : null,
                    isError: contentBlock.getText() && !videoId,
                    blockId: contentBlock.toObject().key,
                    handleRemoveBlock: handleRemoveBlock,
                    onClick: () => createBlock('', '', editor.state, handleChange,getCurrentBlockIndex(editor.state))
                },
            };
        }
    };

    const handleRemoveBlock = (key: string) => {
        const oldBlockMap = editor.state.getCurrentContent().getBlockMap();
        const newBlockMap = oldBlockMap.delete(key);
        const newEditorState = EditorState.push(
            editor.state,
            ContentState.createFromBlockArray(newBlockMap.toArray()),
            'remove-range',
        );
        const indexOfRemovedBlock = oldBlockMap.toArray().findIndex((item) => item.getKey() === key);
        if (indexOfRemovedBlock !== 0) {
            const blockPreRemovedBlock = oldBlockMap
                .toArray()
                .find((value, index) => index === indexOfRemovedBlock - 1);
            const newSelectionState = SelectionState.createEmpty(blockPreRemovedBlock!.getKey()).merge({
                anchorOffset: blockPreRemovedBlock!.getLength(),
                focusOffset: blockPreRemovedBlock!.getLength(),
            });
            handleChange(EditorState.forceSelection(newEditorState, newSelectionState));
        } else handleChange(newEditorState);
    };

    const handleOpenInputLink = (e: any) => {
        e.preventDefault();
        setInputLink({ isOpen: true, value: link, isFocus: true, selectionState: editor.state.getSelection() });
    };

    const handlePressInputLink = (e: any) => {
        if (e.key === 'Enter' && inputRef.current) {
            setInputLink((prev) => ({ ...prev, isFocus: false, isOpen: false }));
            inputRef.current.blur();
            handleToogleLink(inputLink.value);
        }
    };

    const handleToogleLink = (link: string) => {
        const selectionState = editor.state.getSelection();
        const contentStateWithEntity = editor.state.getCurrentContent().createEntity('LINK', 'MUTABLE', { url: link });
        let newEditorState = EditorState.set(editor.state, { currentContent: contentStateWithEntity });
        newEditorState = RichUtils.toggleLink(
            newEditorState,
            selectionState,
            contentStateWithEntity.getLastCreatedEntityKey(),
        );
        handleChange(EditorState.forceSelection(newEditorState, selectionState));
    };

    const handleClearLink = (e: SyntheticEvent) => {
        e.preventDefault();
        setInputLink((prev) => ({ ...prev, value: '' }));
    };

    return (
        <div className={`${className} px-[12px]`}>
            <div>
                <div className="text-[18px] font-semibold mb-[12px] font-bold">{label}:</div>

                <div ref={wrapperRef} className="relative" onKeyDown={handleUndo}>
                    {toolboxOffsetStyle && (
                        <motion.div
                            ref={toolboxRef}
                            key={0}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            className={`absolute z-40 shadow-custom-1 bg-white flex items-center justify-center text-[14px] px-[12px] py-[4px] rounded-lg border-t-4 border-black after:content-[''] after:absolute after:top-full after:inset-x-2/4 after:border-x-[8px] after:border-y-[8px] after:border-transparent after:border-t-white after:translate-x-[-50%]`}
                            style={{
                                top: `${toolboxOffsetStyle.top}px`,
                                left: `${toolboxOffsetStyle.left}px`,
                                transform: 'translate(-50%, -100%)',
                            }}
                        >
                            {inputLink.isOpen ? (
                                <div className="w-[180px] flex items-center gap-[4px] divide-x">
                                    <input
                                        ref={inputRef}
                                        autoFocus
                                        className="focus:outline-none px-[4px] py-[4px] w-full"
                                        value={inputLink.value}
                                        onFocus={(e) => setInputLink((prev) => ({ ...prev, isFocus: true }))}
                                        onChange={(e) => setInputLink((prev) => ({ ...prev, value: e.target.value }))}
                                        onKeyUp={handlePressInputLink}
                                    />
                                    <FontAwesomeIcon
                                        icon={faXmark}
                                        onMouseDown={handleClearLink}
                                        className="cursor-pointer pl-[8px]"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-[8px]">
                                    {[
                                        { name: faBold, command: 'BOLD' },
                                        { name: faItalic, command: 'ITALIC' },
                                        { name: faUnderline, command: 'UNDERLINE' },
                                    ].map((icon, index) => {
                                        const isActive = editor.style.includes(icon.command);

                                        return (
                                            <div
                                                key={index}
                                                className={`px-[6px] py-[2px] rounded-lg cursor-pointer relative transition-all ${
                                                    isActive ? 'text-blue-500' : ''
                                                }`}
                                                onMouseDown={(e) => handleTextStyle(e, icon.command)}
                                            >
                                                <FontAwesomeIcon
                                                    icon={icon.name}
                                                    className="relative z-10 select-none"
                                                />
                                            </div>
                                        );
                                    })}
                                    <div
                                        className={`px-[6px] py-[2px] rounded-lg cursor-pointer relative transition-all ${
                                            link ? 'text-blue-500' : ''
                                        }`}
                                        onMouseDown={handleOpenInputLink}
                                    >
                                        <FontAwesomeIcon icon={faLink} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                    <AnimatePresence>
                        {toolboxType.isFocus && (
                            <motion.div
                                className={`bg-white shadow-custom-2 flex items-center justify-center absolute cursor-pointer ${
                                    toolboxType.isOpen ? 'rounded-lg' : 'rounded-full'
                                }`}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={
                                    toolboxType.offsetTop !== null
                                        ? {
                                              top: toolboxType.offsetTop + 'px',
                                              left: '0',
                                              transform: 'translate(calc(-100% + -16px), -10px)',
                                          }
                                        : {}
                                }
                            >
                                <AnimatePresence>
                                    {toolboxType.isOpen ? (
                                        <motion.div
                                            className="grid grid-cols-2 gap-[8px] px-[12px] py-[8px] overflow-hidden"
                                            initial={{ height: '30px', width: '30px' }}
                                            animate={{ height: 'fit-content', width: 'fit-content' }}
                                            exit={{ height: '30px', width: '30px' }}
                                            // onMouseLeave={() => setToolboxType((prev) => ({ ...prev, isOpen: false }))}
                                        >
                                            {[
                                                {
                                                    icon: faAlignLeft,
                                                    command: 'left',
                                                },
                                                {
                                                    icon: faAlignCenter,
                                                    command: 'center',
                                                },
                                                {
                                                    icon: faAlignJustify,
                                                    command: 'justify',
                                                },
                                                {
                                                    icon: faAlignRight,
                                                    command: 'right',
                                                },
                                                {
                                                    icon: faListUl,
                                                    command: 'ordered-list-item',
                                                },
                                                {
                                                    icon: faYoutube,
                                                    command: 'add-youtube-link',
                                                },
                                            ].map((icon, index) => {
                                                const isActive = editor.type.includes(icon.command);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`px-[8px] py-[2px] text-[16px] transition-all ${
                                                            isActive ? 'text-blue-500' : ''
                                                        }`}
                                                        onMouseDown={(e) => handleType(e, icon.command)}
                                                    >
                                                        <FontAwesomeIcon icon={icon.icon} />
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    ) : (
                                        <div
                                            onMouseDown={handleOpenTypeBox}
                                            className="w-[30px] h-[30px] rounded-full text-[18px] flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEllipsis} />
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Editor
                        preserveSelectionOnBlur
                        customStyleMap={styleMap}
                        blockStyleFn={handleBlockStyle}
                        onBlur={handleBlurEditor}
                        keyBindingFn={handleKeyBinding}
                        handleKeyCommand={handleKeyCommand}
                        blockRendererFn={customRenderBlock}
                        editorState={editor.state}
                        onChange={handleChange}
                        onFocus={handleFocusEditor}
                        // ref={}
                        editorKey="editor"
                    />
                </div>
            </div>
        </div>
    );
}
