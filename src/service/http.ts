export class HTTP {
    private baseUrl = 'http://localhost:4000';

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
        } catch (error) {}
    }

    async post(url: string, payload?: any, option?: object, isSendFile?: boolean) {
        try {
            let body;
            if (isSendFile) {
                body = new FormData();

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
        } catch (error) {}
    }

    async patch(url: string, payload?: any, option?: object, isSendFile?: boolean) {
        try {
            let body;
            if (isSendFile) {
                body = new FormData();

                for (const key in payload) {
                    const value = typeof payload[key] !== 'string' ? JSON.stringify(payload[key]) : payload[key];
                    body.append(key, value);
                }
            } else body = JSON.stringify(payload);
            console.log(body);

            const contentType = isSendFile ? 'multipart/form-data' : 'application/json';

            const result = await fetch(this.baseUrl + url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': contentType,
                    Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
                },
                body,
                ...option,
            });

            return result.json();
        } catch (error) {}
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
        } catch (error) {}
    }
}
