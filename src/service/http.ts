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
                    body.append(key, payload[key]);
                }
            } else body = JSON.stringify(payload);

            const contentType = isSendFile ? 'multipart/form-data' : 'application/json';

            const result = await fetch(this.baseUrl + url, {
                method: 'POST',
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

    // async patch(url: string, payload?: object, option?: object) {
    //     const result = await this.instance.post(url, payload, option);

    //     return result.data;
    // }

    // async delete(url: string, option?: object) {
    //     const result = await this.instance.post(url, option);

    //     return result.data;
    // }
}
