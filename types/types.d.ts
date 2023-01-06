// #region path data
declare type FileData = {
    mime: string,
    /** The size of the file in bytes. */
    size: number,
    contentHash: string,
    /** The timestamp indicating the creation time of this file. */
    created: Date,
    /** The timestamp indicating the last time this file was accessed. */
    accessed: Date,
    /** The timestamp indicating the last time the file status was changed. */
    changed: Date,
    /** The timestamp indicating the last time this file was modified. */
    modified: Date
}

declare type PathData = FileData & {
    exists: boolean,
    isFile: boolean,
    fullPath: string,
    path: string,
    base: string,
    name: string,
    ext: string
}
// #endregion
