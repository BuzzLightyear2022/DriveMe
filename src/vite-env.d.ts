/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EC2_SERVER_HOST: string;
    readonly VITE_EC2_SERVER_PORT: string;
    readonly VITE_IMAGE_DIRECTORY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}