import jwt, { JwtPayload } from "jsonwebtoken";

export const getRoleFromToken = (token: string): string | null => {
    try {
        const decoded = jwt.decode(token);

        // decoded が JwtPayload 型であり、かつ role プロパティが存在する場合
        if (decoded && typeof decoded !== "string" && (decoded as JwtPayload).role) {
            return (decoded as JwtPayload).role as string;  // roleを取得
        }
        return null;  // デコード失敗または role が存在しない場合
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};