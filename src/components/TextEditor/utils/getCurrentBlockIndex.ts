import { EditorState } from "draft-js";

export default function getCurrentBlockIndex(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    const oldBlockMap = contentState.getBlockMap();
    const currentBlockKey = contentState.getBlockForKey(editorState.getSelection().getAnchorKey()).getKey();
    const currentBlockIndex = oldBlockMap
        .toArray()
        .findIndex((value, index) => value.getKey() === currentBlockKey);

    return currentBlockIndex
}