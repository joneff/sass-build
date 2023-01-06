declare type PostcssProcessor = {
    version: string;
    process(css: string | { toString() : string }) : { css: string };
};
