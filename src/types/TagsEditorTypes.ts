import { Tag, Tags } from "./Listas"
import { AddTag, RemoveTag } from "./UseListasTypes"

export type TagsEditorProps = {
    tags:Tags
    inferedTags:Tags
    addTag:AddTag;
    removeTag:RemoveTag;
}