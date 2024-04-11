import { FormData } from '~/app/(ClientLayout)/(MainLayout)/class/components/editClassModal';
import { ClassService } from '~/service';

export class ClassController {
    classService: ClassService;

    constructor() {
        this.classService = new ClassService();
    }

    // Your code here
    async getAllClass() {
        const res = await this.classService.getAllClass();

        return res.data;
    }

    async getClasses(filter?: string) {
        const res = await this.classService.getClasses(filter);

        return res.data;
    }

    async getClass(classUuid: string) {
        // Your code here

        const res = await this.classService.getClass(classUuid);

        return res.data;
    }

    async getCalendar(classUuid: string) {
        const res = await this.classService.getCalendar(classUuid);

        return res.data;
    }

    async createClass(formData: FormData) {
        const theme = `from-[${formData.theme.from}] to-[${formData.theme.to}]`;

        const res = await this.classService.createClass({
            ...formData,
            theme,
        });

        return res.data;
    }

    async joinClass(classUuid: string, userUuid: string) {
        const res = await this.classService.joinClass(classUuid, userUuid);

        return res.data;
    }

    async responseJoinClass(classUuid: string, userUuid: string, approve: boolean) {
        const res = await this.classService.responseJoinClass(classUuid, userUuid, approve);

        return res.data;
    }

    async addMember(classUuid: string, email: string) {
        const res = await this.classService.addMember(classUuid, email);

        return res.data;
    }

    async removeMember(classUuid: string, userUuid: string) {
        const res = await this.classService.removeMember(classUuid, userUuid);

        return res.data;
    }

    async leaveClass(classUuid: string) {
        const res = await this.classService.leaveClass(classUuid);

        return res.data;
    }

    async updateClass(classUuid: string, formData: FormData) {
        const theme = `from-[${formData.theme.from}] to-[${formData.theme.to}]`;

        const res = await this.classService.updateClass(classUuid, {
            ...formData,
            theme,
        });

        return res.data;
    }

    async deleteClass(classUuid: string) {
        const res = await this.classService.deleteClass(classUuid);

        return res.data;
        // Your code here
    }

    async getMembers(classUuid: string) {
        const res = await this.classService.getMembers(classUuid);

        return res.data;
    }
}
