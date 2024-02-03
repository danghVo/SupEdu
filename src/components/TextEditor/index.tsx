'use client';

import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import {
    Editor,
    ContentBlock,
    ContentState,
    EditorState,
    RichUtils,
    SelectionState,
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
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { memo } from 'react';

import Video from './components/Video';
import Link from './components/Link';
import getVideoId from '~/utils/getVideoId';
import getCurrentBlockIndex from './utils/getCurrentBlockIndex';
import createBlock from './utils/createBlock';
import './TextEditor.scss';
import Slider from '../Slider';
import { fontSizeEditor } from '~/constant';

// type
interface MyEditorState {
    state: EditorState;
    style: Array<string>;
    type: string;
}

interface ToolboxOffsetStype {
    top: number;
    left: number;
}

interface ToolboxType {
    offsetTop: number;
    isOpen: boolean;
    isFocus: boolean;
}

interface InputLink {
    isOpen: boolean;
    isFocus: boolean;
    value: string;
    selectionState: SelectionState | null;
}

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

function TextEditor({
    editorState,
    className = '',
    label,
    onChange,
}: {
    editorState: EditorState | null;
    className?: string;
    label: string;
    onChange: (editorState: EditorState) => void;
}) {
    const [editor, setEditor] = useState<MyEditorState>({
        state:
            editorState ||
            EditorState.createWithContent(
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

    const [toolboxOffsetStyle, setToolboxOffsetStyle] = useState<ToolboxOffsetStype | null>(null);

    const [toolboxType, setToolboxType] = useState<ToolboxType>({ offsetTop: 16, isOpen: false, isFocus: false });

    const [inputLink, setInputLink] = useState<InputLink>({
        isOpen: false,
        value: '',
        isFocus: false,
        selectionState: null,
    });

    const [link, setLink] = useState('');
    const [isCreateNewBlock, setIsCreateNewBlock] = useState(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const toolboxRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const editorRef = useRef<any>(null);

    useEffect(() => {
        let offsetTop = toolboxType.offsetTop;
        const currentBlockKey = editor.state
            .getCurrentContent()
            .getBlockForKey(editor.state.getSelection().getStartKey())
            .getKey();

        if (wrapperRef.current) {
            const wrapperRect = wrapperRef.current.getBoundingClientRect();

            if (currentBlockKey) {
                const currentBlockElement = document.querySelector(`div[data-offset-key^="${currentBlockKey}"]`);
                if (currentBlockElement) {
                    const currentBlockElementRect = currentBlockElement!.getBoundingClientRect();

                    offsetTop = currentBlockElementRect.top + 4 - wrapperRect.top;
                }
            } else if (!editor.state.getCurrentContent().getPlainText()) {
                offsetTop = 16;
            }

            setToolboxType((prev) => ({ ...prev, offsetTop }));
        }
    }, [editor.state, toolboxType.isFocus]);

    useEffect(() => {
        const selection = editor.state.getSelection();
        if (selection.getHasFocus() && !selection.isCollapsed()) {
            const selectionRect = getVisibleSelectionRect(window);
            if (wrapperRef.current && selectionRect) {
                const wrapperRect = wrapperRef.current?.getBoundingClientRect();

                const transform = (selectionRect.width * 50) / 100;

                setToolboxOffsetStyle({
                    top: selectionRect.top - wrapperRect.top - 16,
                    left:
                        selectionRect.left -
                        wrapperRect.left +
                        (selectionRect.width >= wrapperRect.width ? 16 : transform),
                });
            }
        } else {
            setToolboxOffsetStyle(null);
            setInputLink((prev) => ({ ...prev, value: '', isOpen: false }));
        }
    }, [editor.state]);

    useEffect(() => {
        if (isCreateNewBlock) {
            createBlock('', '', editor.state, handleChange, getCurrentBlockIndex(editor.state));
            setIsCreateNewBlock(false);
        }
    }, [isCreateNewBlock]);

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

    const handleBlurEditor = useCallback(() => {
        if (!inputLink.isFocus) {
            setToolboxOffsetStyle(null);
            setToolboxType((prev) => ({ ...prev, isFocus: false, isOpen: false }));
            onChange(editor.state);
        }
    }, [inputLink]);

    const handleTextStyle = (e: SyntheticEvent, command: string) => {
        e.preventDefault();
        e.stopPropagation();
        let newEditorState = RichUtils.toggleInlineStyle(editor.state, command);

        handleChange(EditorState.forceSelection(newEditorState, editor.state.getSelection()));
    };

    const handleBlockStyle = (contentBlock: ContentBlock) => {
        const boxTypes = contentBlock.getType();
        let cssTypes = '';

        if (boxTypes.includes('youtubeInput')) {
            return 'my-[12px] px-[16px] py-[12px] bg-slate-100';
        }

        const position = ['left', 'right', 'center', 'justify'].forEach((item) => {
            if (boxTypes.includes('position-' + item)) {
                cssTypes += `position-apply-${item} `;
            }
        });

        const fontSize = ['medium', 'big'].forEach((item) => {
            if (boxTypes.includes('size-' + item)) cssTypes += `size-${item} `;
        });

        return cssTypes;
    };

    const handleToogleTypeBox = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setToolboxType((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    };

    const handleType = useCallback(
        (e: SyntheticEvent, command: string, type: string) => {
            e.preventDefault();
            if (command === 'add-youtube-link') {
                return createBlock(
                    'add-youtube-link',
                    '',
                    editor.state,
                    handleChange,
                    getCurrentBlockIndex(editor.state),
                );
            }

            const currentBlock = editor.state
                .getCurrentContent()
                .getBlockForKey(editor.state.getSelection().getAnchorKey());
            let currentType = currentBlock.getType();
            let newType = currentType;
            let setCommand = command;

            if (type) {
                setCommand = `${type}-${command}`;
            }

            if (currentType !== 'unstyled' && command !== 'ordered-list-item') {
                if (type && currentType.includes(type)) {
                    newType = currentType
                        .split(' ')
                        .filter((item: string) => !item.includes(type))
                        .join(' ');
                }
                if (!currentType.includes(`${setCommand}`)) {
                    newType += ` ${setCommand}`;
                }
            } else newType = setCommand;

            let newEditorState = RichUtils.toggleBlockType(editor.state, newType);

            handleChange(newEditorState);
        },
        [editor.state],
    );

    const handleKeyBinding = (e: any) => {
        const currentContent = editor.state.getCurrentContent();
        const currentSelection = editor.state.getSelection().getAnchorKey();
        const currentBlock = currentContent.getBlockForKey(currentSelection);
        const selection = editor.state.getSelection();

        if (e.key === 'Enter' && currentBlock.getType() === 'add-youtube-link') {
            return 'loadYoutubeVideo';
        }

        if (currentBlock.getType() === 'ordered-list-item' && wrapperRef.current) {
            const isFirstBlock = wrapperRef.current.querySelector(`ol[data-offset-key^="${currentBlock.getKey()}"]`);
            const depth = currentBlock.getDepth();
            if (e.keyCode == 8 && selection.getAnchorOffset() === 0 && wrapperRef.current) {
                if (depth === 0 && isFirstBlock) {
                    handleChange(RichUtils.toggleBlockType(editor.state, 'ordered-list-item'));

                    return 'removeList';
                } else if (depth > 0) {
                    const newCurrentBlock = currentBlock.set('depth', depth - 1) as ContentBlock;

                    const newBlockMap = editor.state
                        .getCurrentContent()
                        .getBlockMap()
                        .set(currentBlock.getKey(), newCurrentBlock);

                    const newContentState = editor.state
                        .getCurrentContent()
                        .merge({ blockMap: newBlockMap }) as ContentState;

                    handleChange(EditorState.push(editor.state, newContentState, 'adjust-depth'));
                    return 'adjustDepth';
                }
            }

            if (e.key === 'Tab' && currentBlock.getType() === 'ordered-list-item') {
                if (!isFirstBlock) {
                    handleChange(RichUtils.onTab(e, editor.state, 1));
                    return 'subList';
                } else return 'noAction';
            }
        }

        return getDefaultKeyBinding(e);
    };

    const handleKeyCommand = useCallback(
        (command: string, editorState: EditorState) => {
            if (command === 'loadYoutubeVideo') {
                const currentContent = editor.state.getCurrentContent();
                const currentSelection = editor.state.getSelection().getAnchorKey();
                const currentBlock = currentContent.getBlockForKey(currentSelection);
                if (getVideoId(currentBlock.getText())) {
                    handleChange(RichUtils.toggleBlockType(editorState, 'loadYoutubeVideo'));
                    setIsCreateNewBlock(true);
                    return 'handled';
                } else return 'not-handled';
            }
            if (command === 'removeList') {
                return 'handled';
            }
            if (command === 'subList') {
                return 'handled';
            }
            if (command === 'adjustDepth') {
                return 'handled';
            }
            if (command === 'noAction') {
                handleChange(EditorState.forceSelection(editor.state, editor.state.getSelection()));
                return 'handled';
            }
            return 'not-handled';
        },
        [editor.state],
    );

    const handleRemoveBlock = useCallback(
        (removeKey: string) => {
            const oldBlockMap = editor.state.getCurrentContent().getBlockMap();
            let prevIndex = 0;
            const newBlockMap = oldBlockMap.toArray().filter((value, index, blockMap) => {
                if (value.getKey() === removeKey) {
                    prevIndex = index - 1;
                    return false;
                } else {
                    return true;
                }
            });

            const newEditorState = EditorState.push(
                editor.state,
                ContentState.createFromBlockArray(newBlockMap),
                'remove-range',
            );

            if (prevIndex >= 0) {
                const blockPreRemovedBlock = oldBlockMap.toArray()[prevIndex];
                const newSelectionState = SelectionState.createEmpty(blockPreRemovedBlock!.getKey()).merge({
                    anchorOffset: blockPreRemovedBlock!.getLength(),
                    focusOffset: blockPreRemovedBlock!.getLength(),
                });
                handleChange(EditorState.forceSelection(newEditorState, newSelectionState));
            } else handleChange(newEditorState);
        },
        [editor.state],
    );

    const customRenderBlock = (contentBlock: ContentBlock) => {
        const type = contentBlock.getType();
        if (type === 'add-youtube-link' || type === 'loadYoutubeVideo') {
            const videoId = getVideoId(contentBlock.getText());
            const clickToNewLine = () =>
                createBlock('', '', editor.state, handleChange, getCurrentBlockIndex(editor.state));
            return {
                component: Video,
                editable: type === 'add-youtube-link',
                props: {
                    src: type === 'loadYoutubeVideo' ? videoId : null,
                    isError: contentBlock.getText() && !videoId,
                    blockId: contentBlock.toObject().key,
                    handleRemoveBlock: handleRemoveBlock,
                    onClick: type === 'loadYoutubeVideo' ? clickToNewLine : () => {},
                },
            };
        }
    };

    const handleOpenInputLink = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
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

    const handleClearLink = useCallback(
        (e: SyntheticEvent) => {
            e.preventDefault();
            e.stopPropagation();
            if (inputLink.value) {
                setInputLink((prev) => ({ ...prev, value: '' }));
                handleChange(RichUtils.toggleLink(editor.state, editor.state.getSelection(), null));
            } else setInputLink((prev) => ({ ...prev, isOpen: false }));
        },
        [inputLink],
    );

    const handleMouseDown = (e: any) => {
        const targetElement = e.target as HTMLDivElement;
        window.getSelection()?.collapse(targetElement);
    };

    return (
        <div className={`${className} px-[12px]`}>
            <div>
                <div className="text-[18px] font-semibold mb-[12px] font-bold">{label}:</div>

                <div ref={wrapperRef} className="relative" onKeyDown={handleUndo} onMouseDown={handleMouseDown}>
                    <AnimatePresence>
                        {toolboxOffsetStyle && (
                            <motion.div
                                ref={toolboxRef}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className={`absolute z-40 shadow-custom-1 bg-white flex items-center justify-center text-[14px] px-[12px] py-[4px] rounded-lg border-t-4 border-black after:content-[''] after:absolute after:top-full after:inset-x-2/4 after:border-x-[8px] after:border-y-[8px] after:border-transparent after:border-t-white after:translate-x-[-50%]`}
                                style={{
                                    top: `${toolboxOffsetStyle.top}px`,
                                    left: `${toolboxOffsetStyle.left}px`,
                                    transform: 'translate(-50%, -100%)',
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
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
                                            onChange={(e) =>
                                                setInputLink((prev) => ({ ...prev, value: e.target.value }))
                                            }
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
                    </AnimatePresence>
                    <AnimatePresence>
                        {toolboxType.isFocus && (
                            <div
                                className={`absolute flex flex-col items-end gap-[8px]`}
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
                                <motion.div
                                    onMouseDown={handleToogleTypeBox}
                                    initial={{ opacity: 0.5 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="bg-white shadow-custom-2 w-[30px] h-[30px] rounded-full text-[18px] flex items-center justify-center"
                                >
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </motion.div>
                                <AnimatePresence>
                                    {toolboxType.isOpen && (
                                        <motion.div
                                            className="bg-white shadow-custom-2 rounded-lg grid grid-cols-2 overflow-hidden"
                                            initial={{ height: '0', width: '0' }}
                                            animate={{ height: 'fit-content', width: 'fit-content' }}
                                            exit={{ height: 0, width: 0 }}
                                        >
                                            <Slider
                                                data={fontSizeEditor}
                                                clickItem={(e, item) => handleType(e, item, 'size')}
                                                itemUI={(item) => <div>{item}</div>}
                                                initItemIndex={fontSizeEditor.findIndex((value) =>
                                                    editor.type.includes(`size-${value}`),
                                                )}
                                            />
                                            {[
                                                {
                                                    icon: faAlignLeft,
                                                    command: 'left',
                                                    type: 'position',
                                                },
                                                {
                                                    icon: faAlignCenter,
                                                    command: 'center',
                                                    type: 'position',
                                                },
                                                {
                                                    icon: faAlignJustify,
                                                    command: 'justify',
                                                    type: 'position',
                                                },
                                                {
                                                    icon: faAlignRight,
                                                    command: 'right',
                                                    type: 'position',
                                                },
                                                {
                                                    icon: faListUl,
                                                    command: 'ordered-list-item',
                                                    type: '',
                                                },
                                                {
                                                    icon: faYoutube,
                                                    command: 'add-youtube-link',
                                                    type: '',
                                                },
                                            ].map((icon, index) => {
                                                const isActive = editor.type.includes(icon.command);

                                                return (
                                                    <div
                                                        key={index}
                                                        className={` py-[8px] px-[12px] text-[16px] transition-all flex justify-center cursor-pointer ${
                                                            isActive ? 'text-blue-500' : ''
                                                        }`}
                                                        onMouseDown={(e) => handleType(e, icon.command, icon.type)}
                                                    >
                                                        <FontAwesomeIcon icon={icon.icon} />
                                                    </div>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </AnimatePresence>

                    <Editor
                        placeholder="Nhập nội dung..."
                        customStyleMap={styleMap}
                        blockStyleFn={handleBlockStyle}
                        onBlur={handleBlurEditor}
                        keyBindingFn={handleKeyBinding}
                        handleKeyCommand={handleKeyCommand}
                        blockRendererFn={customRenderBlock}
                        editorState={editor.state}
                        onChange={handleChange}
                        onFocus={handleFocusEditor}
                        editorKey="editor"
                        ref={editorRef}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(TextEditor);
