import { Tag } from "./Listas";
import { AddTag, RemoveTag } from "./UseListasTypes";

export type TagComponentProps = Tag & {
    tagId:string;
    addTag:AddTag;
    removeTag:RemoveTag;
}