import { FormData } from '~/app/(ClientLayout)/(MainLayout)/class/components/createClassModal';
import { ClassService } from '~/service';

export class ClassController {
    // Your code here
    async getAllClass() {
        const classService = new ClassService();

        const res = await classService.getAllClass();

        return res.data;
    }

    async getClasses(filter?: string) {
        const classService = new ClassService();

        const res = await classService.getClasses(filter);

        return res.data;
    }

    async getClass(classUuid: string) {
        // Your code here
        const classService = new ClassService();

        const res = await classService.getClass(classUuid);

        return res.data;
    }

    async createClass(formData: FormData, userUuid: string) {
        const classService = new ClassService();

        const theme = `from-[${formData.theme.from}] to-[${formData.theme.to}]`;

        const res = await classService.createClass({
            ...formData,
            theme,
            teacher: userUuid,
        });

        return res.data;
    }

    async joinClass(classUuid: string, userUuid: string) {
        const classService = new ClassService();

        const res = await classService.joinClass(classUuid, userUuid);

        return res.data;
    }

    async updateClass() {
        // Your code here
    }

    async deleteClass() {
        // Your code here
    }
}
