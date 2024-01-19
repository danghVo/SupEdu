import { ContentBlock, ContentState, EditorState, SelectionState, genKey } from "draft-js";

export default function createBlock(type: string, text: string, editorState: EditorState,handleChange: (editorState: EditorState) => void, atIndex?: number) {
    const newContentBlock = new ContentBlock({
        key: genKey(),
        type,
        text
    });
    const contentState = editorState.getCurrentContent();
    const oldBlockMap = contentState.getBlockMap();
    let newBlockMap = [ ...oldBlockMap.toArray(), newContentBlock ]

    if(atIndex) {
        newBlockMap = oldBlockMap
        .toArray()
        .reduce(
            (accu: any, curr, index) =>
            index === atIndex ? [...accu, curr, newContentBlock] : [...accu, curr],
            [],
            );
    } 

    const newEditorState = EditorState.push(
        editorState,
        ContentState.createFromBlockArray(newBlockMap),
        'insert-fragment',
    );

    return handleChange(
        EditorState.forceSelection(newEditorState, SelectionState.createEmpty(newContentBlock.toObject().key)),
    );
}