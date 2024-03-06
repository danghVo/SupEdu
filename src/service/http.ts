export class HTTP {
    private baseUrl = 'http://localhost:4000';

    constructor(private accessToken: string | null) {}

    async get(url: string, option?: object) {
        const result = await fetch(this.baseUrl + url, {
            ...option,
            headers: {
                Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
            },
        });

        return result.json();
    }

    async post(url: string, payload?: object, option?: object) {
        const result = await fetch(this.baseUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: this.accessToken ? `Bearer ${this.accessToken}` : '',
            },
            body: JSON.stringify(payload),
            ...option,
        });

        return result.json();
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
