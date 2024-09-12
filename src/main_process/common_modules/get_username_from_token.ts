import jwt, { JwtPayload } from "jsonwebtoken";

export const getUsernameFromToken = (token: string): string | null => {
    try {
        const decoded = jwt.decode(token);

        if (decoded && typeof decoded !== "string" && (decoded as JwtPayload).username) {
            return (decoded as JwtPayload).username as string;
        }
        return null;
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};