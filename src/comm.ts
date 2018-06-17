export interface ISong {
    _id: string;
    _rev: string;
    title: string;
    date: number;
    image_url?: string;
    url: string;
    othersongs?: string[];
    ratings: {
        up: number;
        down: number;
    };
}

export interface IUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    mfa_enabled: boolean;
    email?: string;
    elevated: boolean;
}

export interface ICouchResponse {
    ok: boolean;
    id: string;
    rev: string;
}

export interface ICouchError {
    message: string;
    name: string;
    error: string;
    reason: string;
    statusCode: number;
}

export async function getDiscordUser(): Promise<IUser | undefined> {
    const response = await fetch("https://dusterthefirst.ddns.net:38564/auth/discord/@me", {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("discordauthkey")}`
        },
        method: "POST",
        mode: "cors"
    });
    const json = await response.json();
    if (json.message) {
        window.localStorage.removeItem("discordauthkey");
        return undefined;
    }
    return json;
}

export async function getAllSongs(): Promise<ISong[]> {
    const response = await fetch("https://dusterthefirst.ddns.net:38564/songs", {
        method: "GET",
        mode: "cors"
    });
    return await response.json();
}

export async function getSong(id: string): Promise<ISong> {
    const response = await fetch(`https://dusterthefirst.ddns.net:38564/songs/${id}`, {
        method: "GET",
        mode: "cors"
    });
    return await response.json();
}

export async function addSong(song: ISong): Promise<ICouchResponse | ICouchError> {
    const response = await fetch(`https://dusterthefirst.ddns.net:38564/songs`, {
        body: JSON.stringify(song),
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("discordauthkey")}`,
            "Content-Type": "application/json"
        },
        method: "POST",
        mode: "cors"
    });
    return await response.json();
}

export async function updateSong(song: ISong, id: string): Promise<ICouchResponse | ICouchError> {
    const response = await fetch(`https://dusterthefirst.ddns.net:38564/songs/${id}`, {
        body: JSON.stringify(song),
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("discordauthkey")}`,
            "Content-Type": "application/json"
        },
        method: "PUT",
        mode: "cors"
    });
    return await response.json();
}

export async function deleteSong(id: string): Promise<ICouchResponse | ICouchError> {
    const response = await fetch(`https://dusterthefirst.ddns.net:38564/songs/${id}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("discordauthkey")}`,
        },
        method: "DELETE",
        mode: "cors"
    });
    return await response.json();
}