import { buffer } from 'stream/consumers';

export class HTTP {
    private baseUrl = 'http://localhost:4000/api';

    constructor(private accessToken: string | null) {}

    async get(url: string, option?: object) {
        try {
            const result = await fetch(this.baseUrl + url, {
                ...option,
                headers: {
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
            });

            return result.json();
        } catch (error) {
            return { data: { error: error } };
        }
    }

    async post(url: string, payload?: any, option?: object, isSendFile?: boolean) {
        try {
            let body;
            if (isSendFile) {
                body = new FormData();

                if (payload.file) {
                    const buffer = await payload.file.arrayBuffer();

                    payload['hashFile'] = await crypto.subtle.digest('SHA-256', buffer);
                } else if (payload.files) {
                    payload['hashFiles'] = {};

                    for await (const file of payload.files) {
                        const buffer = await file.arrayBuffer();
                        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                        payload['hashFiles'][file.name] = Array.from(new Uint8Array(hashBuffer))
                            .map((b) => b.toString(16).padStart(2, '0'))
                            .join('');
                    }
                }

                for (const key in payload) {
                    if (payload[key] === undefined || payload[key] === null) continue;
                    let value;
                    if (key === 'file') {
                        value = payload[key];
                    } else if (key === 'files') {
                        for (let i = 0; i < payload[key].length; i++) {
                            body.append('files', payload[key][i]);
                        }
                        continue;
                    } else value = typeof payload[key] !== 'string' ? JSON.stringify(payload[key]) : payload[key];

                    body.append(key, value);
                }
            } else body = JSON.stringify(payload);

            const contentType = !isSendFile ? { 'Content-Type': 'application/json' } : undefined;

            const result = await fetch(this.baseUrl + url, {
                method: 'POST',
                headers: {
                    ...contentType,
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
                body,
                ...option,
            });

            return await result.json();
        } catch (error) {
            console.log(error);
            return { data: { error: error } };
        }
    }

    async patch(url: string, payload?: any, option?: object, isSendFile?: boolean) {
        try {
            let body;
            if (isSendFile) {
                body = new FormData();

                if (payload.file) {
                    const buffer = await payload.file.arrayBuffer();

                    payload['hashFile'] = await crypto.subtle.digest('SHA-256', buffer);
                } else if (payload.files) {
                    payload['hashFiles'] = {};

                    for await (const file of payload.files) {
                        const buffer = await file.arrayBuffer();
                        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                        payload['hashFiles'][file.name] = Array.from(new Uint8Array(hashBuffer))
                            .map((b) => b.toString(16).padStart(2, '0'))
                            .join('');
                    }
                }

                for (const key in payload) {
                    if (payload[key] === undefined || payload[key] === null) continue;
                    let value;
                    if (key === 'file') {
                        value = payload[key];
                    } else if (key === 'files') {
                        for (let i = 0; i < payload[key].length; i++) {
                            body.append('files', payload[key][i]);
                        }
                        continue;
                    } else value = typeof payload[key] !== 'string' ? JSON.stringify(payload[key]) : payload[key];

                    body.append(key, value);
                }
            } else body = JSON.stringify(payload);

            const contentType = !isSendFile ? { 'Content-Type': 'application/json' } : undefined;

            const result = await fetch(this.baseUrl + url, {
                method: 'PATCH',
                headers: {
                    ...contentType,
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
                body,
                ...option,
            });

            return result.json();
        } catch (error) {
            console.log(error);
            return { data: { error: error } };
        }
    }

    async put(url: string, payload?: any, option?: object, isSendFile?: boolean) {
        try {
            let body;
            if (isSendFile) {
                body = new FormData();

                if (payload.file) {
                    const buffer = await payload.file.arrayBuffer();

                    payload['hashFile'] = await crypto.subtle.digest('SHA-256', buffer);
                } else if (payload.files) {
                    payload['hashFiles'] = {};

                    for await (const file of payload.files) {
                        const buffer = await file.arrayBuffer();
                        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
                        payload['hashFiles'][file.name] = Array.from(new Uint8Array(hashBuffer))
                            .map((b) => b.toString(16).padStart(2, '0'))
                            .join('');
                    }
                }

                for (const key in payload) {
                    if (payload[key] === undefined || payload[key] === null) continue;
                    let value;
                    if (key === 'file') {
                        value = payload[key];
                    } else if (key === 'files') {
                        for (let i = 0; i < payload[key].length; i++) {
                            body.append('files', payload[key][i]);
                        }
                        continue;
                    } else value = typeof payload[key] !== 'string' ? JSON.stringify(payload[key]) : payload[key];

                    body.append(key, value);
                }
            } else body = JSON.stringify(payload);

            const contentType = !isSendFile ? { 'Content-Type': 'application/json' } : undefined;

            const result = await fetch(this.baseUrl + url, {
                method: 'PUT',
                headers: {
                    ...contentType,
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
                body,
                ...option,
            });

            return result.json();
        } catch (error) {
            console.log(error);

            return { data: { error: error } };
        }
    }

    async delete(url: string, option?: object) {
        try {
            const result = await fetch(this.baseUrl + url, {
                method: 'DELETE',
                headers: {
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
                ...option,
            });

            return result.json();
        } catch (error) {
            return { data: { error: error } };
        }
    }
}
