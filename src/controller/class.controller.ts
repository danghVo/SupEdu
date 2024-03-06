import { ClassService } from '~/service';

export class ClassController {
    // Your code here
    async getClasses() {
        const classService = new ClassService();

        return await classService.getClasses();
    }

    async getClass() {
        // Your code here
    }

    async createClass() {
        // Your code here
    }

    async updateClass() {
        // Your code here
    }

    async deleteClass() {
        // Your code here
    }
}
