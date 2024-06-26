import NoImagePng from "../../assets/NoImage.png";

export const loadImage = async (args: { fileName?: string, width: string, height: string }): Promise<HTMLImageElement> => {
    const serverHost: string = await window.serverInfo.serverHost();
    const serverPort: string = await window.serverInfo.port();
    const imageDirectory: string = await window.serverInfo.imageDirectory();

    const imgElement: HTMLImageElement = new Image();
    Object.assign(imgElement.style, {
        objectFit: "contain",
        width: args.width,
        height: args.height
    });

    imgElement.addEventListener("dragstart", (event: MouseEvent) => {
        event.preventDefault();
    }, false);

    imgElement.onerror = () => {
        imgElement.src = NoImagePng;
    };

    if (args.fileName) {
        imgElement.src = `https://${serverHost}:${serverPort}/${imageDirectory}/${args.fileName}`;
        return imgElement;
    } else {
        imgElement.src = NoImagePng;
        return imgElement;
    }
}